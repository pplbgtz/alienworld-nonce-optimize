const { createHash } = require('crypto');

const arraytohex = (bf) => { 
    return [...new Uint8Array(bf)].map(b => b.toString(16).padStart(2, "0")).join(""); 
};

const getRand = (account, lasttxbuff) => {
    const arr = new Uint8Array(24);
    for (let i = 0; i < 8; i++) arr[i] = account[i];
    for (let i = 8; i < 16; i++) {
        arr[i] = lasttxbuff[i-8];
    }
    return arr;
}

const pushName = (s) => {
    let charToSymbol = function (c) {
        if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) return (c - 'a'.charCodeAt(0)) + 6;
        if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) return (c - '1'.charCodeAt(0)) + 1;
        return 0;
    };
    let a = new Uint8Array(8); let bit = 63;
    for (let i = 0; i < s.length; ++i) {
        let c = charToSymbol(s.charCodeAt(i));
        if (bit < 5) c = c << 1;
        for (let j = 4; j >= 0; --j) { 
            if (bit >= 0) { 
                a[Math.floor(bit / 8)] |= ((c >> j) & 1) << (bit % 8); 
                --bit; 
            }
        }
    }
    return a;
}

const reRand = (arr) => {
    for (let i = 16; i < 24; i++) arr[i] = parseInt(Math.floor(Math.random() * 255));
    return arr;
}
// ==================================================================
// find nonce process
const account = "2e1la.c.wam"; // change to your wax account || เปลี่ยนเป็นชื่อบัญชี wax
const lastminetx = "8dcdc1863e970c6efdd7d74fca8d32113768de894fad2081ad15e046dc111af3"; // same here || เอาธุรกรรมขุดล่าสุดมาใส่
const difficulty = 0;

let start = Date.now(); // start time
let rand = getRand(pushName(account),Array.from(Buffer.from(lastminetx, 'hex'))); // get rand uint 8 array ( 0-16 ) from Account name and last mine transaction
let hash, itr = 0; 

while (true) {
    rand = reRand(rand);
    hash = createHash('sha256').update(rand).digest('hex');
    if ( hash.substr(0, 4) == `0000` && hash[4] <= difficulty ) break;
    itr++
}
let end = Date.now();
rand = arrayToHex(rand.slice(16, 24)); // nonce
console.log(`[${account}] : Found hash in ${itr} iterations with ${account} ${rand}, last = ${hash[4]}, hex_digest ${hash} taking ${(end - start) / 1000}s`)
//console.log(arrayToHex(rand.slice(16, 24)))
console.log(`ITR : ${itr} | RPS : ${parseFloat(itr/(((new Date()).getTime() - start) / 1000)).toFixed(0)} | process time : ${((new Date()).getTime() - start) / 1000}`)

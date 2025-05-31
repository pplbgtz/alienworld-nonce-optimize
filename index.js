const { createHash } = require('node:crypto'); // for new node js version is have built in crypto module

const arrayToHex = (bf) => { 
    return [...new Uint8Array(bf)].map(b => b.toString(16).padStart(2, "0")).join(""); 
};

const charToSymbol = function (c) {
    if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) return (c - 'a'.charCodeAt(0)) + 6;
    if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) return (c - '1'.charCodeAt(0)) + 1;
    return 0;
};

const pushName = (s) => {
    let a = new Uint8Array(8), bit = 63;
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
};

// ==================================================================
// find nonce process
const account = "2e1la.c.wam"; // change to your wax account || เปลี่ยนเป็นชื่อบัญชี wax
const lastminetx = "8dcdc1863e970c6efdd7d74fca8d32113768de894fad2081ad15e046dc111af3"; // last mine transaction id || เอาธุรกรรมขุดล่าสุดมาใส่
const difficulty = 0;

let start = Date.now(); // start time
let accountBuffer = pushName(account);
let lastMineBuffer = Array.from(Buffer.from(lastminetx, 'hex'));

let hash, itr = 0; 
const arr = new Uint8Array(24);
for (let i = 0; i < 8; i++) arr[i] = accountBuffer[i];
for (let i = 8; i < 16; i++) arr[i] = lastMineBuffer[i-8];

const targetBuffer = Buffer.from(`0000${difficulty}fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`, 'hex');

while ((Buffer.compare(createHash('sha256').update(arr).digest(), targetBuffer) > 0)) {
    itr++;

    arr[16] = (itr >> 56) & 0xFF;
    arr[17] = (itr >> 48) & 0xFF;
    arr[18] = (itr >> 40) & 0xFF;
    arr[19] = (itr >> 32) & 0xFF;
    arr[20] = (itr >> 24) & 0xFF;
    arr[21] = (itr >> 16) & 0xFF;
    arr[22] = (itr >> 8) & 0xFF;
    arr[23] = itr & 0xFF;
}

hash = createHash('sha256').update(arr).digest('hex');

let end = Date.now();
rand = arrayToHex(arr.slice(16, 24)); // nonce

console.log(`${account} : Found hash in ${itr} nonce ${rand}, last = ${hash[4]}, hex_digest ${hash} taking ${(end - start) / 1000}s`);
//2e1la.c.wam : Found hash in 210706 nonce 789540ca2cd7dda4, last = 0, hex_digest 000006c2e5322afd635267cedb6a5ba01307232ba594f0bc45392f816030f7eb taking 0.182s

console.log(`ITR : ${itr} | RPS : ${parseFloat(itr/((end - start) / 1000)).toFixed(0)} | process time : ${(end - start) / 1000}`);
//ITR : 210706 | RPS : 1157725 | process time : 0.182

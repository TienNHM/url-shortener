import { check } from "k6";
import http from "k6/http";
import { SharedArray } from "k6/data";
import { Rate } from "k6/metrics";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const VUS = 200;
export let options = {
    // stages: [
    //   {duration: "1m", target: 400},
    //   {duration: "5m", target: 400},
    // ]
    vus: VUS,
    duration: "5m",
    rps: VUS
};

const API = 'shorten'
var url = `http://localhost:3000/${API}`;
const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
};

export default function (data) {
    const code = randomString(10);
    const body = JSON.stringify({
        originalUrl: `https://www.google.com/search?q=${code}`,
        bias: code
    });
    let res = http.post(url, body, {
        headers: headers
    });

    if (!res.body || !res.body.includes('"error":null')) {
        console.log(JSON.stringify(res.body));
    }

    var success = check(res, {
        // "log": res => console.log(JSON.stringify(res)),
        [`${API} is status 200`]: (r) => res.status === 200,
        [`${API} body not contains error`]: (r) => res.body.includes('"error":null')
    });
};
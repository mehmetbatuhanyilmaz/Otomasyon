import http from 'k6/http';
import { check } from 'k6';
 
const baseUrl = 'https://frontend-php.test.misli.tc/api/web/v1';
 
export let options = {
    vus: 1400, // 1400 sanal kullanıcı
    duration: '1m', // Test süresi (örneğin, 1 dakika)
};
 
// Setup function to retrieve the token before the test starts
export function setup() {
    const credentials = {
        "username": "54664189496",
        "password": "TestEaa1"
    };
 
    let loginRes = http.post(`${baseUrl}/auth/login`,
        JSON.stringify(credentials),
        {
            headers: {
                'Content-Type': 'application/json',
                'channel-type': 'WEB'
            }
        }
    );
 
    check(loginRes, {
        'login status is 200': (r) => r.status === 200
    });
 
    let token = loginRes.json().data.accessToken;
    return { token: token }; // Return the token to make it available in default function
}
 
export default function(data) {
    const token = data.token; // Use the token from setup function
 
    const sportotoActive = http.get(`${baseUrl}/sportoto/active`);
    const activeDraw = sportotoActive.json().data.draw.drawNumber;
 
    const sportotoCredantials = {
        "drawid": activeDraw,
        "couponAmountTotal": "4.0",
        "multiplier": 2,
        "selections": [
            {
                "columnAmount": 2,
                "columnSelections": {
                    "0": { "MS1": true, "MSX": false, "MS2": false },
                    "1": { "MS1": true, "MSX": false, "MS2": false },
                    "2": { "MS1": true, "MSX": false, "MS2": false },
                    "3": { "MS1": true, "MSX": false, "MS2": false },
                    "4": { "MS1": true, "MSX": false, "MS2": false },
                    "5": { "MS1": true, "MSX": false, "MS2": false },
                    "6": { "MS1": true, "MSX": false, "MS2": false },
                    "7": { "MS1": true, "MSX": false, "MS2": false },
                    "8": { "MS1": true, "MSX": false, "MS2": false },
                    "9": { "MS1": true, "MSX": false, "MS2": false },
                    "10": { "MS1": true, "MSX": false, "MS2": false },
                    "11": { "MS1": true, "MSX": false, "MS2": false },
                    "12": { "MS1": true, "MSX": false, "MS2": false },
                    "13": { "MS1": true, "MSX": false, "MS2": false },
                    "14": { "MS1": true, "MSX": false, "MS2": false }
                }
            }
        ]
    };
 
    let sportotoPlay = http.post(`${baseUrl}/sportoto/wager/purchase`,
        JSON.stringify(sportotoCredantials), {
        headers: {
            Authorization: "Bearer " + token,
            'Content-Type': 'application/json',
        }
    });
 
    check(sportotoPlay, {
        'sportotoPlay status is 200': (r) => r.status === 200,
        'sportotoPlay body includes sgCoupon Id': (r) => r.body.includes("sgCouponId")
    });
}
 
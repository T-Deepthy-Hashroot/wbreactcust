import {setSelectedMajorGroup} from "./authority_renewal_manager";
import Log from "nsglobals/Log";
import chemicalsReply from "../assets/chemicalsReply.json";
import CryptoJS from "crypto-js";

let racf=null;
let majorGroup=null;


export function isLoggedIn() {
    return racf!=null;
}

export function setLogin( _racf ){
    racf = _racf;
    Log.info("Logged in as: " + racf, 'user.jsx:setLogin()');
}

export function getRacf() {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(chemicalsReply.result), 'secret key 123');
    console.log(chemicalsReply.result)  
    const task = encodeURIComponent(ciphertext);
    console.log(task)
      window.open("http://localhost:4200/#/authority-renewal/" + task); 
    return racf;
}

export function setMajorGroup( _majorGroup ) {
    majorGroup = _majorGroup;
    setSelectedMajorGroup(majorGroup);
}

export function getMajorGroup() {

    return majorGroup;
}




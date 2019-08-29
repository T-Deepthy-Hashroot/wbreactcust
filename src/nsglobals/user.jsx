
import {setSelectedMajorGroup} from "./authority_renewal_manager";
import Log from "nsglobals/Log";


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
    return racf;
}

export function setMajorGroup( _majorGroup ) {
    majorGroup = _majorGroup;
    setSelectedMajorGroup(majorGroup);
}

export function getMajorGroup() {
    return majorGroup;
}




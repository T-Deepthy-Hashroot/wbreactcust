import React from "react";
import NumberFormat from "react-number-format";



const SI_PREFIXES = ["", "K", "M", "G", "T", "P", "E"];
// E.g. returns the number 10,000 formatted as 10K or 1,100,000 as 1.1G etc.
export function systemOfUnitsFormat(number) {

    // what tier? (determines SI prefix)
    const tier = Math.log10(number) / 3 | 0;

    // if zero, we don't need a prefix
    if (tier === 0) return <NumberFormat value={number} displayType={"text"} thousandSeparator={true} prefix={"$"}/>;

    // get prefix and determine scale
    const postfix = SI_PREFIXES[tier];
    const scale = Math.pow(10, tier * 3);

    // scale the number
    const scaled = number / scale;

    // format number and add prefix as suffix
    return <div> ${scaled.toFixed(1)}{postfix} </div>;
}


import React, { useState } from "react";

type BoolObjSetState<K> = (key: keyof K) => void;

export default function useBoolean(initial: boolean) {

    // if (typeof initial === "boolean") {
        const [bool, setBool] = useState(initial);

        const on = () => {
            setBool(true);
        }
    
        const off = () => {
            setBool(false);
        }
    
        const toggle = () => {
            setBool(!bool);
        }
    
        const boolActions = {
            on: on,
            off: off,
            toggle: toggle
        }
    
        return [bool, boolActions] as const;
    // } else {
    //     const [boolObj, setBoolObj] = useState(initial);

    //     const setTrue = (key: keyof K) => {
    //         const newState = {...boolObj};
    //         newState[key] = true as K[keyof K];
    //         setBoolObj(newState)
    //     }

    //     const setFalse = (key: keyof K) => {
    //         const newState = {...boolObj};
    //         newState[key] = false as K[keyof K];
    //         setBoolObj(newState)
    //     }

    //     const toggleBool = (key: keyof K) => {
    //         const newState = {...boolObj};
    //         newState[key] = !newState[key] as K[keyof K];
    //         setBoolObj(newState)
    //     }

    //     const boolActions = {
    //         setTrue: setTrue,
    //         setFalse: setFalse,
    //         toggleBool: toggleBool
    //     }

    //     return [boolObj, boolActions] as [K, {setTrue: (key: keyof K) => void, setFalse: }]
    // }
    
}
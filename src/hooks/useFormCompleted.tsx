import { useBoolean } from "@chakra-ui/react";
import { useEffect } from "react";
import { strObjAllPropertiesSet } from "../services/helperFunctions";

export default function useFormComplete<K extends {[key: string]: string}>(formState: K) {

    const [
        formComplete,
        { on: setFormCompleteTrue, off: setFormCompleteFalse },
      ] = useBoolean(false);


    useEffect(() => {
        if (strObjAllPropertiesSet(formState)) {
            setFormCompleteTrue();
        } else {
            setFormCompleteFalse();
        }
    }, [formState]);

    return formComplete;
}
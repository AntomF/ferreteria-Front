import CryptoJS from "crypto-js";
import { secretkey } from "../constants/secret-key";

export const dataEncrypt=(value)=>{
    return CryptoJS.AES.encrypt(JSON.stringify(value),secretkey).toString();
}
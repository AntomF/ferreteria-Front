import CryptoJS from "crypto-js";
import { secretkey } from "../constants/secret-key";
export const dataDecrypts=(value)=>{
    const bytes=CryptoJS.AES.decrypt(value,secretkey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
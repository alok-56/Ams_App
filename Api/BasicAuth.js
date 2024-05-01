import {encode as base64Encode} from 'base-64';
const Username = 'SVVG';
const Password = 'Pass@123';
export const basicAuth = 'Basic ' + base64Encode(Username + ':' + Password);

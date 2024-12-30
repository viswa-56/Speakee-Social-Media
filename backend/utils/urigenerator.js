import DataURIParser from "datauri/parser.js";
import path from "path";

const getDatauri= (file) =>{
    const parser = new DataURIParser()
    const extname = path.extname(file.originalname).toString();
    return parser.format(extname,file.buffer);
};

export default getDatauri
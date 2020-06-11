import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
//consegue gerar um hash aleatório

export default {
    storage: multer.diskStorage({
        //onde vai para os arquivos que foram feitos upload pelos usuários
        destination: path.resolve(__dirname, '..','..', 'uploads'),
        filename(request, file, callback) {
            //gerar hash
            const hash = crypto.randomBytes(6).toString('hex');
            //vai gerar um hash aleatório de 6 bytes e vai converter para uma string hexadecimal

            const fileName = `${hash}-${file.originalname}`;

            callback(null, fileName);
        }
    }),
};
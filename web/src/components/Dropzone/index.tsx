import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
    onFileUploaded: (file: File) => void;
    //void nao tem retorno
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
//Dropzone é uma FunctionComponent que aceita as propriedades
    const [selectedFileUrl, setSelectedFileUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);
    }, [onFileUploaded])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*'
        //qualquer tipo de imagem
    })

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*"/>

            { selectedFileUrl
                ? <img src={selectedFileUrl} alt="Point thumbnail" />
                : (
                    <p>
                        <FiUpload />
                        Imagem do estabelecimento
                    </p>
                )
            }            
        </div>
    )
}

export default Dropzone;
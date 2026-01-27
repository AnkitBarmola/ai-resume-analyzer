import {useCallback} from "react";
import {useDropzone} from "react-dropzone";

const FileUploader = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle the uploaded files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
          <div className="space-y-4 cursor-pointer">
             <div className=" mx-auto w-16 flex items-center justify-center">
               <img src="/icons/info.svg" alt='Upload' className="size-20" />
             </div>
             { File ? (
               <div>
                
               </div>
              ) : (
                <div>
                    <p className="text-lg text-grey-500 ">
                      <span className="font-semibold"></span>
                    </p>
                </div>
                )}
          </div>
      </div>
    </div>
  )
}

export default FileUploader


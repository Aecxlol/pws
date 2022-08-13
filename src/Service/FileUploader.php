<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploader
{
    /**
     * @var mixed
     */
    private mixed $targetDirectory;

    /**
     * @var SluggerInterface
     */
    private SluggerInterface $slugger;

    /**
     * @param $targetDirectory
     * @param SluggerInterface $slugger
     */
    public function __construct($targetDirectory, SluggerInterface $slugger)
    {
        # $targetDirectory is defined in services.yaml
        $this->targetDirectory = $targetDirectory;
        $this->slugger         = $slugger;
    }

    /**
     * @param UploadedFile $file
     * @return string
     */
    public function upload(UploadedFile $file): string
    {
        # stores the filename only (e.g. my_image.png to my_image) thanks to the const PATHINFO_FILENAME
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        # slugifies the name (e.g. my_image to my-image)
        $safeFilename = $this->slugger->slug($originalFilename);
        # adds a unique id to the file name and the extension. It will give my-image-15648978944.extension
        $fileName = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        ### THE FOLLOWING SNIPPET IS TO GET A DYNAMIC TARGET DIRECTORY DEPENDING ON WHERE THE UPLOAD FUNCTION IS CALLED ###
        # gets the absolute path of the controller where the upload function is called
        $dynamicTargetDirectory = debug_backtrace()[0]['file'];
        # extracts the controller name
        preg_match('/[a-zA-Z]+Controller/', $dynamicTargetDirectory, $match);
        $dynamicTargetDirectory = implode('', $match);
        $dynamicTargetDirectory = str_replace('CRUDController', '', $dynamicTargetDirectory);

        $dynamicTargetDirectory = strtolower($dynamicTargetDirectory);
        $dynamicTargetDirectory = $this->getTargetDirectory() . $dynamicTargetDirectory;

        try {
            # moves the uploaded file to the target directory
            $file->move($dynamicTargetDirectory, $fileName);
        } catch (FileException $e) {
            throw new FileException($e->getMessage());
        }

        return $fileName;
    }

    /**
     * @return mixed
     */
    public function getTargetDirectory(): mixed
    {
        return $this->targetDirectory;
    }
}
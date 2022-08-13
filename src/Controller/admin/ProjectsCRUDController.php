<?php

namespace App\Controller\admin;

use App\Entity\Image;
use App\Entity\Project;
use App\Form\Type\ProjectType;
use App\Helper\Helper;
use App\Repository\ProjectRepository;
use App\Service\FileUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class ProjectsCRUDController extends AbstractController
{
    private string $currentPage;

    public function __construct(private ProjectRepository $projectRepository, private RequestStack $requestStack)
    {
        $this->currentPage = Helper::getPageName($this->requestStack->getCurrentRequest()->getPathInfo());
    }

    #[Route('/admin/projects', name: 'app_admin_projects')]
    public function index(): Response
    {
        $projects = $this->projectRepository->findAll();

        return $this->render('admin/projects/show.html.twig', [
            'projects' => $projects,
            'currentPage' => $this->currentPage
        ]);
    }

    #[Route('/admin/projects/create', name: 'app_admin_projects_create', methods: ['GET', 'POST'])]
    public function create(Request $request, FileUploader $fileUploader): Response
    {

        $project = new Project();
        $form    = $this->createForm(ProjectType::class, $project);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var UploadedFile $projectLogoFile */
            $projectLogoFile = $form->get('logo')->getData();

            /** @var UploadedFile $projectImagesFiles */
            $projectImagesFiles = $form->get('images')->getData();

            # this condition is mandatory since the logo and images fields are not required
            if ($projectLogoFile && $projectImagesFiles) {
                # uploads the file and sets a unique name to the file
                $projectLogoFileName = $fileUploader->upload($projectLogoFile);
                $project->setLogo($projectLogoFileName);

                foreach ($projectImagesFiles as $projectImagesFile) {
                    $projectImagesFileName = $fileUploader->upload($projectImagesFile);
                    $img                   = new Image();

                    $img->setProject($project);
                    $img->setUrl($projectImagesFileName);
                    $project->addImages($img);
                }
            }

            $this->projectRepository->add($project, flush: true);
            $this->addFlash('success', "Le projet {$project->getName()} a bien été ajouté");

            return $this->redirectToRoute('app_admin_projects');
        }

        return $this->renderForm('admin/projects/create.html.twig', [
            'form' => $form,
            'currentPage' => $this->currentPage
        ]);
    }
}

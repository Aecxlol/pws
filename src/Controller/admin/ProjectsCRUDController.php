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
    /**
     * @var string
     */
    private string $currentPage;

    /**
     * @param ProjectRepository $projectRepository
     * @param RequestStack $requestStack
     */
    public function __construct(private ProjectRepository $projectRepository, private RequestStack $requestStack)
    {
        $this->currentPage = Helper::getPageName($this->requestStack->getCurrentRequest()->getPathInfo());
    }

    /**
     * @return Response
     */
    #[Route('/admin/projects', name: 'app_admin_projects')]
    public function index(): Response
    {
        $projects = $this->projectRepository->findAll();

        return $this->render('admin/projects/show.html.twig', [
            'projects' => $projects,
            'currentPage' => $this->currentPage
        ]);
    }

    /**
     * @param Request $request
     * @param FileUploader $fileUploader
     * @return Response
     */
    #[Route('/admin/projects/create', name: 'app_admin_projects_create', methods: ['GET', 'POST'])]
    public function create(Request $request, FileUploader $fileUploader, SluggerInterface $slugger): Response
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
                $project->setSlug($slugger->slug($form->getName()));

                foreach ($projectImagesFiles as $projectImagesFile) {
                    $projectImagesFileName = $fileUploader->upload($projectImagesFile);
                    $img                   = new Image();

                    $img->setProject($project);
                    $img->setUrl($projectImagesFileName);
                    $project->addImages($img);
                }
            }

            $this->projectRepository->add($project, flush: true);
            $this->addFlash('success', "Le projet <strong>{$project->getName()}</strong> a bien été ajouté");

            return $this->redirectToRoute('app_admin_projects');
        }

        return $this->renderForm('admin/projects/create.html.twig', [
            'form' => $form,
            'currentPage' => $this->currentPage
        ]);
    }
}

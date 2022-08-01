<?php

namespace App\Controller\admin;

use App\Entity\Skill;
use App\Form\Type\SkillType;
use App\Helper\Helper;
use App\Repository\SkillRepository;
use App\Service\FileUploader;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class SkillsController extends AbstractController
{
    private string $currentPage;

    public function __construct(private SkillRepository $skillRepository, private RequestStack $requestStack, private SluggerInterface $slugger)
    {
        $this->requestStack = $requestStack;
        $this->currentPage  = Helper::getPageName($this->requestStack->getCurrentRequest()->getPathInfo());
    }

    #[Route('/admin/skills', name: 'app_admin_skills', methods: 'GET')]
    public function index(): Response
    {
        $skills = $this->skillRepository->findAll();

        return $this->render('admin/skills/show.html.twig', [
            'skills' => $skills,
            'currentPage' => $this->currentPage
        ]);
    }

    #[Route('/admin/skills/create', name: 'app_admin_skills_create', methods: ['GET', 'POST'])]
    public function create(Request $request): Response
    {
        $skill = new Skill();
        $form  = $this->createForm(SkillType::class, $skill);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $skillImage = $form->get('image')->getData();

            if ($skillImage) {
                $fileUploader   = new FileUploader('img/skills', $this->slugger);
                $skillImageName = $fileUploader->upload($skillImage);
                $skill->setImage($skillImageName);
                $skill = $form->getData();

                $this->skillRepository->add($skill, flush: true);
                $this->addFlash('success', "La compétence {$skill->getName()} a bien été ajoutée");

                return $this->redirectToRoute('app_admin_skills');
            }
        }

        return $this->renderForm('admin/skills/create.html.twig', [
            'form' => $form,
            'currentPage' => $this->currentPage,
            'skill' => $skill
        ]);
    }

    #[Route('/admin/skills/update/{id}', name: 'app_admin_skills_update', methods: 'GET')]
    public function update(int $id, Request $request): Response
    {
        $skill = $this->skillRepository->findOneBy(compact('id'));
        $form = $this->createForm(SkillType::class, $skill);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $skill = $form->getData();
            $this->skillRepository->add($skill, flush: true);
            $this->addFlash('success', "La compétence {$skill->getName()} a bien été éditée");

            return $this->redirectToRoute('app_admin_skills');
        }

        return $this->render('admin/skills/update.html.twig', [
            'skill' => $skill,
            'form' => $form->createView()
        ]);

    }

    #[Route('/admin/skills/delete/{id}', name: 'app_admin_skills_delete', methods: 'GET')]
    public function delete(int $id): Response
    {
        $skill = $this->skillRepository->findOneBy(compact('id'));
        $file  = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR . 'skills' . DIRECTORY_SEPARATOR . $skill->getImage();

        $this->skillRepository->remove($skill, flush: true);
        if (file_exists($file)) {
            unlink($file);
        }

        $this->addFlash('success', "La compétence {$skill->getName()} a bien été supprimée");
        return $this->redirectToRoute('app_admin_skills');
    }
}

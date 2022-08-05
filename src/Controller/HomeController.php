<?php

namespace App\Controller;

use App\Repository\SkillRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(SkillRepository $skillRepository): Response
    {
        $skills = $skillRepository->findAll();

        return $this->render('frontend/index.html.twig', compact('skills'));
    }

    #[Route('/', name: 'app_home_contact_form')]
    public function lol(SkillRepository $skillRepository): Response
    {


        return $this->render('frontend/index.html.twig', compact('skills'));
    }
}

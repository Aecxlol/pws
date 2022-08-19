<?php

namespace App\Controller;

use App\Repository\ProjectRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Requirement\Requirement;

class PortfolioController extends AbstractController
{
    #[Route('/portfolio/{slug}',
        name: 'app_portfolio',
        requirements: [
            'slug' => Requirement::ASCII_SLUG
        ]
    )]
    public function index(string $slug, ProjectRepository $projectRepository): Response
    {
        $project = $projectRepository->findOneBy(compact('slug'));

        return $this->render('frontend/portfolio/index.html.twig', compact('project', 'slug'));
    }
}

<?php

namespace App\Controller\admin;

use App\Helper\Helper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SkillsController extends AbstractController
{
    #[Route('/admin/skills', name: 'app_admin_skills')]
    public function index(Request $request): Response
    {
        $currentPage = Helper::getPageName($request->getPathInfo());

        return $this->render('admin/skills/show.html.twig', compact('currentPage'));
    }
}

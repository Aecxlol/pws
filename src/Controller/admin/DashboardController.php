<?php

namespace App\Controller\admin;

use App\Helper\Helper;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractController
{
    #[Route('%app.admin_path%', name: 'app_admin_dashboard')]
    #[IsGranted('ROLE_ADMIN')]
    public function index(Request $request): Response
    {
        $currentPage = Helper::getPageName($request->getPathInfo());

        return $this->render('admin/dashboard/show.html.twig', compact('currentPage'));
    }
}

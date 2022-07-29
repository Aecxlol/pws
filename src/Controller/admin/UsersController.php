<?php

namespace App\Controller\admin;

use App\Entity\User;
use App\Form\Type\UserType;
use App\Helper\Helper;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UsersController extends AbstractController
{
    private string $currentPage;

    public function __construct(private UserRepository $userRepository, private RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->currentPage = Helper::getPageName($this->requestStack->getCurrentRequest()->getPathInfo());
    }

    #[Route('/admin/users', name: 'app_admin_users', methods: 'GET')]
    public function index(Request $request): Response
    {
        $users       = $this->userRepository->findAll();

        return $this->render('admin/users/show.html.twig', [
            'users' => $users,
            'currentPage' => $this->currentPage
        ]);
    }

    #[Route('/admin/users/create', name: 'app_admin_users_create', methods: ['GET', 'POST'])]
    public function create(Request $request): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $form->getData();
            $this->userRepository->add($user, flush: true);
            $this->addFlash('success', "L'utilisateur {$user->getName()} a bien été ajouté");

            return $this->redirectToRoute('app_admin_users');
        }

        return $this->renderForm('admin/users/create.html.twig', [
            'form' => $form,
            'currentPage' => $this->currentPage
        ]);
    }

    /**
     * @param int $id
     * @param Request $request
     * @return Response
     */
    #[Route('/admin/users/update/{id}', name: 'app_admin_users_update', methods: 'GET')]
    public function update(int $id, Request $request): Response
    {
        $user = $this->userRepository->findOneBy(compact('id'));
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $form->getData();
            $this->userRepository->add($user, flush: true);
            $this->addFlash('success', "L'utilisateur {$user->getName()} a bien été ajouté");

            return $this->redirectToRoute('app_admin_users');
        }

        return $this->render('admin/users/update.html.twig', [
            'user' => $user,
            'form' => $form->createView()
        ]);
    }

    /**
     * @param int $id
     * @return Response
     */
    #[Route('/admin/users/delete/{id}', name: 'app_admin_users_delete', methods: 'GET')]
    public function delete(int $id): Response
    {
        $user = $this->userRepository->findOneBy(compact('id'));
        $this->userRepository->remove($user, flush: true);
        $this->addFlash('success', "L'utilisateur {$user->getName()} a bien été supprimé");

        return $this->redirectToRoute('app_admin_users');
    }
}

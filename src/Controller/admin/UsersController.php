<?php

namespace App\Controller\admin;

use App\Entity\User;
use App\Form\Type\UserType;
use App\Repository\UserRepository;
use Doctrine\ORM\NonUniqueResultException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UsersController extends AbstractController
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    #[Route('/admin/users', name: 'app_admin_users', methods: 'GET')]
    public function index(): Response
    {
        $users = $this->userRepository->findAll();

        return $this->render('admin/users/show.html.twig', compact('users'));
    }

    #[Route('/admin/users/create', name: 'app_admin_users_create', methods: ['GET', 'POST'])]
    public function create(Request $request): Response
    {
        $user = new User();

        $user->setRoles(['ROLE_USER']);

        $form = $this->createForm(UserType::class, $user);

        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid())
        {
            $user = $form->getData();
            $this->userRepository->add($user, flush: true);

            $this->addFlash('success', "L'utilisateur {$user->getName()} a bien été ajouté");

            return $this->redirectToRoute('app_admin_users');
        }

        return $this->renderForm('admin/users/create.html.twig', compact('form'));
    }

    /**
     * @param string $userName
     * @return Response
     * @throws NonUniqueResultException
     */
    #[Route('/admin/users/edit/{userName}', name: 'app_admin_users_edit', methods: 'GET')]
    public function edit(string $userName): Response
    {
        $user = $this->userRepository->findOneByUserName($userName);

        return $this->render('admin/users/edit.html.twig', compact('user'));
    }
}

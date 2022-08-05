<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Form\Type\ContactType;
use App\Repository\SkillRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(SkillRepository $skillRepository, Request $request): Response
    {
        $skills = $skillRepository->findAll();

        $contact = new Contact();
        $form = $this->createForm(ContactType::class, $contact);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $this->addFlash('success', 'Votre email a bien été envoyé');
            $this->redirectToRoute('app_home');
        }

        return $this->render('frontend/index.html.twig', [
            'skills' => $skills,
            'form' => $form->createView()
        ]);
    }

//    #[Route('/', name: 'app_home_show_contact_form')]
//    public function showContactForm(Request $request): Response
//    {
//        $contact = new Contact();
//        $form = $this->createForm(ContactType::class, $contact);
//        $form->handleRequest($request);
//
//        if($form->isSubmitted() && $form->isValid()) {
//            $this->addFlash('success', 'Votre email a bien été envoyé');
//            $this->redirectToRoute('app_home');
//        }
//
//        return $this->renderForm('frontend/index.html.twig', compact('form'));
//    }
}

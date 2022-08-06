<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Form\Type\ContactType;
use App\Repository\SkillRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @throws TransportExceptionInterface
     */
    #[Route('/', name: 'app_home')]
    public function index(SkillRepository $skillRepository, Request $request, MailerInterface $mailer): Response
    {
        # SKILLS
        $skills = $skillRepository->findAll();


        # CONTACT
        $contact = new Contact();
        $form = $this->createForm(ContactType::class, $contact);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
            $formData = $form->getData();

            $email = (new TemplatedEmail())
                ->from(Address::create($formData->getFirstname() . ' ' . $formData->getLastname() . '<' . $formData->getEmail() . '> ' . $this->getParameter('app.name')))
                ->to($this->getParameter('app.contact_email'))
                ->subject($formData->getSubject())
                ->htmlTemplate('/frontend/emails/email_template.html.twig')
                ->context([
                   'message' => $formData->getMessage()
                ]);

            $mailer->send($email);

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
//        return $this->renderForm('frontend/section/contact.html.twig', [
//            'form' => $form
//        ]);
//    }
}

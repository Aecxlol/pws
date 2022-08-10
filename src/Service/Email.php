<?php

namespace App\Service;

use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class Email
{
    public function __construct(private MailerInterface $mailer, private ContainerBagInterface $containerBag)
    {
    }

    /**
     * @param $formData
     * @param $template
     * @return void
     * @throws TransportExceptionInterface
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function send($formData, $template)
    {
        $from = sprintf("%s %s <%s>", $formData->getFirstname(), $formData->getLastname(), $formData->getEmail());

        $email = (new TemplatedEmail())
            ->from(Address::create($from))
            ->to($this->containerBag->get('app.contact_email'))
            ->subject($formData->getSubject())
            ->htmlTemplate($template)
            ->context([
                'firstname' => $formData->getFirstname(),
                'lastname' => $formData->getLastname(),
                'subject' => $formData->getSubject(),
                'message' => $formData->getMessage()
            ]);

        $this->mailer->send($email);
    }
}
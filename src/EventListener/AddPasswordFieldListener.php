<?php

namespace App\EventListener;

use App\Entity\User;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use JetBrains\PhpStorm\NoReturn;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AddPasswordFieldListener
{
    /**
     * @param UserPasswordHasherInterface $passwordHasher
     */
    public function __construct(private UserPasswordHasherInterface $passwordHasher)
    {
    }

    /**
     * @param LifecycleEventArgs $args
     * @return void
     */
    #[NoReturn] public function prePersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if ($entity instanceof User && $entity->getPlainPassword()) {
            $hashedPassword = $this->passwordHasher->hashPassword($entity, $entity->getPlainPassword());
            $entity->setPassword($hashedPassword);
        }
    }
}
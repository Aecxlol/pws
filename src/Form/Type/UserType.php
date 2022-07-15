<?php

namespace App\Form\Type;

use App\Entity\User;
use App\EventListener\AddPasswordFieldListener;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('email')
            ->add('plainPassword');
//            ->add('roles', ChoiceType::class, [
//                'choices' => [
//                    'admin' => null,
//                    'user' => true,
//                ]
//            ])
    }

    /**
     * @param OptionsResolver $resolver
     * @return void
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
           'data_class' => User::class
        ]);
    }
}
<?php

namespace App\Form\Type;

use App\Entity\Project;
use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\NotBlank;

class ProjectType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nom du projet',
                'constraints' => [
                    new NotBlank()
                ]
            ])
            ->add('logo', FileType::class, [
                'label' => 'Logo du projet',
                // unmapped means that this field is not associated to any entity property
                'mapped' => false,
                // optional so I don't have to re-upload the PDF file
                // every time I edit the Project details
                'required' => false,
                // unmapped fields can't define their validation using annotations
                // in the associated entity, so I use the PHP constraint classes
                'constraints' => [
                    new File([
                        'maxSize' => '1024k',
                        'mimeTypes' => [
                            'image/jpeg',
                            'image/png'
                        ],
                        'mimeTypesMessage' => 'Le format du fichier est invalide (jpeg/png sont acceptés)'
                    ])
                ]
            ])
            ->add('images', FileType::class, [
                'label' => 'Logo du projet',
                'mapped' => false,
                'required' => false,
                'multiple' => true,
//                'constraints' => [
//                    new File([
//                        'maxSize' => '1024k',
//                        'mimeTypes' => [
//                            'image/jpeg',
//                            'image/png'
//                        ],
//                        'mimeTypesMessage' => 'Le format du fichier est invalide (jpeg/png sont acceptés)'
//                    ])
//                ]
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description du projet',
                'constraints' => [
                    new NotBlank()
                ]
            ])
            ->add('link', TextType::class, [
                'label' => 'Lien du projet',
                'constraints' => [
                    new NotBlank()
                ]
            ])
            ->add('gitLink', TextType::class, [
                'label' => 'Lien git du projet'
            ])
            ->add('user', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'name'
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Project::class,
        ]);
    }
}

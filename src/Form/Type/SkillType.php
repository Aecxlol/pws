<?php

namespace App\Form\Type;

use App\Entity\Skill;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;

class SkillType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('image', FileType::class, [
                'label' => 'Image (.png .jpeg)',
                // unmapped means that this field is not associated to any entity property
                'mapped' => false,
                // optional so I don't have to re-upload the PDF file
                // every time I edit the Skill details
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
                        'mimeTypesMessage' => 'Le format de fichier est invalide (jpeg/png sont acceptés)',
                    ])
                ]
            ])
            ->add('level')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Skill::class,
        ]);
    }
}

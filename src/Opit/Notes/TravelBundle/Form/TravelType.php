<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Opit\Notes\TravelBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Opit\Notes\TravelBundle\Form\DataTransformer\UserIdToObjectTransformer;

/**
 * Description of TravelType
 *
 * @author OPIT\Notes
 */
class TravelType extends AbstractType
{
    /**
     * Builds a form with given fields.
     *
     * @param object  $builder A Formbuilder interface object
     * @param array   $options An array of options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $entityManager = $options['em'];
        $transformer = new UserIdToObjectTransformer($entityManager);
        
        $builder->add($builder->create('user', 'hidden')->addModelTransformer($transformer));
        $builder->add('user_ac', 'text', array(
            'label' => 'Employee name',
            'data' => ($user = $options['data']->getUser()) ? $user->getEmployeeName() : null,
            'mapped' => false,
            'attr' => array('placeholder' => 'Employee name', 'class' => 'test')
        ));
        $builder->add('departure_date', 'date', array(
            'widget' => 'single_text',
            'label'=>'Departure date',
            'attr' => array('placeholder' => 'Departure date')
        ));
        $builder->add('arrival_date', 'date', array(
            'widget' => 'single_text',
            'label'=>'Arrival date',
            'attr' => array('placeholder' => 'Arrival date')
        ));
        $builder->add('customer_related', 'choice', array(
            'required' => true,
            'data' => 'No',
            'label'=>'Customer related',
            'choices' => array('1'=>'No', '0'=>'Yes')
        ));
        $builder->add('opportunity_name', 'text', array(
            'label'=>'Opportunity name',
            'required' => false,
            'attr' => array('placeholder' => 'Opportunity name')
        ));
        $builder->add('trip_purpose', 'text', array(
            'label'=>'Trip purpose',
            'attr' => array('placeholder' => 'Trip purpose', 'class' => 'width-big')
        ));
        $builder->add('destinations', 'collection', array(
            'type' => new DestinationType(),
            'allow_add' => true,
            'allow_delete' => true,
            'by_reference' => false
        ));
        $builder->add('accomodations', 'collection', array(
            'type' => new AccomodationType(),
            'allow_add' => true,
            'allow_delete' => true,
            'by_reference' => false
        ));

        $builder->add(
            $builder->create('team_manager', 'hidden')->addModelTransformer($transformer)
        );
        $builder->add('team_manager_ac', 'text', array(
            'label' => 'Team manager',
            'data' => ($user = $options['data']->getTeamManager()) ? $user->getEmployeeName() : null,
            'mapped' => false,
            'required' => false,
            'attr' => array('placeholder' => 'Team manager')
        ));
        $builder->add(
            $builder->create('general_manager', 'hidden')->addModelTransformer($transformer)
        );
        $builder->add('general_manager_ac', 'text', array(
            'label' => 'General manager',
            'data' => ($user = $options['data']->getGeneralManager()) ? $user->getEmployeeName() : null,
            'mapped' => false,
            'attr' => array('placeholder' => 'General manager')
        ));
        
        $builder->add('Add travel request', 'submit', array(
            'label'=>$options['data']->getUser() ? 'Edit travel request' : 'Add travel request',
            'attr' => array('class' => 'button')
        ));
    }
    
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Opit\Notes\TravelBundle\Entity\TravelRequest',
        ))
        ->setRequired(array(
            'em',
        ))
        ->setAllowedTypes(array(
            'em' => 'Doctrine\Common\Persistence\ObjectManager',
        ));
    }

    public function getName()
    {
        return 'travelRequest';
    }
}

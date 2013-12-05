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

/**
 * Description of AccomodationType
 *
 * @author OPIT\Notes
 */
class AccomodationType extends AbstractType
{
    /**
     * Builds a form with given fields.
     *
     * @param object  $builder A Formbuilder interface object
     * @param array   $options An array of options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('hotel_name', 'text', array(
            'label'=>'Hotel name',
            'attr' => array(
                'placeholder' => 'Hotel name'
            )
        ));
        $builder->add('city', 'text', array('attr' => array(
            'placeholder' => 'City'
        )));
        $builder->add('number_of_nights', 'integer', array(
            'label'=>'Number of nights',
            'attr' => array(
                'placeholder' => 'Number of nights'
            )
        ));
        $builder->add('cost', 'integer', array('attr' => array(
            'placeholder' => 'Cost'
        )));
    }
    
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Opit\Notes\TravelBundle\Entity\TRAccomodation',
        ));
    }

    public function getName()
    {
        return '';
    }
}

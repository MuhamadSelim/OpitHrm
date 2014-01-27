<?php

/*
 * This file is part of the Travel bundle.
 *
 * (c) Opit Consulting Kft. <info@opit.hu>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Opit\Notes\TravelBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Opit\Notes\TravelBundle\Entity\NotificationStatus;
use Doctrine\Common\Persistence\ObjectManager;

/**
 * travel bundle status fixtures
 *
 * @author OPIT Consulting Kft. - NOTES Team - {@link http://www.opit.hu}
 * @version 1.0
 * @package Opit
 * @subpackage TravelBundle
 */
class NotificationStatusFixtures extends AbstractFixture implements OrderedFixtureInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * {@inheritDoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }
    
    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $notificationStates = array('unread', 'seen', 'read');
        
        for ($i = 0; $i < count($notificationStates); $i++) {
            $notificationStatus = new NotificationStatus();
            $notificationStatus->setNotificationStatusName($notificationStates[$i]);
            $manager->persist($notificationStatus);
        }
        
        $manager->flush();
    }
    
     /**
     * {@inheritDoc}
     */
    public function getOrder()
    {
        return 8; // the order in which fixtures will be loaded
    }
}

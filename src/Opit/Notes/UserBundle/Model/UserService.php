<?php

/*
 *  This file is part of the {Bundle}.
 * 
 *  (c) Opit Consulting Kft. <info@opit.hu>
 * 
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 */

namespace Opit\Notes\UserBundle\Model;

use Symfony\Component\Security\Core\User\UserInterface;
use Opit\Component\Email\EmailManagerInterface;
use Symfony\Component\Security\Core\Encoder\EncoderFactoryInterface;

/**
 * Description of UserService
 *
 * @author OPIT Consulting Kft. - PHP Team - {@link http://www.opit.hu}
 * @version 1.0
 * @package Notes
 * @subpackage UserBundle
 */
class UserService
{
    protected $mail;
    protected $encoder;
    protected $password;

    public function __construct(EmailManagerInterface $mail, EncoderFactoryInterface $encoder)
    {
        $this->mail = $mail;
        $this->encoder = $encoder;
        $this->password = '';
    }
    
    /**
     * Method to send a mail to the user that his account has been created 
     * or that his password has been reset.
     * 
     * @param UserInterface $user
     * @param boolean $isReset
     */
    public function sendNewPasswordMail(UserInterface $user, $isReset = false)
    {
        $subject = '[NOTES] - New account created';
        $template = 'newAccount';
        if ($isReset) {
            $subject = '[NOTES] - Password reset';
            $template = 'passwordReset';
        }
        
        $this->mail->setRecipient($user->getEmail());
        $this->mail->setSubject($subject);
        
        $this->mail->setBodyByTemplate(
            'OpitNotesUserBundle:Mail:' . $template . '.html.twig',
            array('password' => $this->password, 'user' => $user)
        );
        
        $this->mail->sendMail();
    }
    
    /**
     * Method to generate a random string.
     * 
     * @param integer $length
     * @return string
     */
    public function generatePassword($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        for ($i = 0; $i < $length; $i++) {
            $this->password .= $characters[rand(0, strlen($characters) - 1)];
        }
        
        return $this->password;
    }
    
    /**
     * Method to encode password.
     * 
     * @param UserInterface $user
     * @param string $password
     * @return string
     */
    public function encodePassword(UserInterface $user, $password = null)
    {
        if (null === $password) {
            $this->generatePassword();
        }
        
        return $this->encoder->getEncoder($user)->encodePassword($this->password, $user->getSalt());
    }
}

<?php

namespace App\User\Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use App\User\Entity\UserProvider;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;

date_default_timezone_set("UTC");

class IndexController
{
    public function newUserForm(Request $request, Application $app)
    {
        $companies = $app['repository.user']->getCompanies();

        $data = array(
                'USER_FIRSTNAME' => 'Your firstname',
                'USER_LASTNAME' => 'Your lastname',
                'USER_LOGIN' => '',
                'USER_PASSWORD' => 'Your password',
                'USER_ACTIVE' => 1,
                'ADDRESS_STREET' => 'Numero et nom de rue',
                'ADDRESS_CITY' => 'Ville',
                'ADDRESS_ZIPCODE' => 'Code postal',
                'ADDRESS_COUNTRY' => 'Pays',
                'CONTACT_PHONE' => 'Votre num de tel',
                'CONTACT_MAIL' => 'Votre adresse mail',
                'PROFILE_ID' => '',
                'COMP_ID' => '',
            );

        $form = $app['form.factory']->createBuilder(FormType::class, $data)
            ->add('USER_FIRSTNAME')
            ->add('USER_LASTNAME')
            ->add('USER_LOGIN')
            ->add('USER_PASSWORD', RepeatedType::class, array(
                                                    'type' => PasswordType::class,
                                                    'options' => array('attr' => array('class' => 'password-field')),
                                                    'required' => true,
                                                    'first_options'  => array('label' => 'Password'),
                                                    'second_options' => array('label' => 'Repeat Password'),
                                                    ))
            ->add('ADDRESS_STREET')
            ->add('ADDRESS_CITY')
            ->add('ADDRESS_ZIPCODE')
            ->add('ADDRESS_COUNTRY')
            ->add('CONTACT_PHONE')
            ->add('CONTACT_MAIL')
            ->add('PROFILE_ID', ChoiceType::class, array( 'choices' => array('Admin' => 1, 'Manager' => 2, 'Driver' => 3)))
            ->add('COMP_ID', ChoiceType::class, array(
                                                           'choices'=> $companies,
                                                           ))
            ->getForm();

        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid())
        {
            $test = $form->getData();
            $app['repository.user']->insert($test);

            return $app['twig']->render('index.html.twig');
        }

        return $app['twig']->render('users.list.html.twig', array('form' => $form->createView()));

    }


    public function addUser(Request $request, Application $app)
    {
        $parameters= $request->request->all();
        $app['repository.user']->insert($parameters);

        return true;
    }

    public function index(Request $request, Application $app)
    {
        return $app['twig']->render('index.html.twig');
    }
    public function login(Request $request, Application $app)
    {
        return $app['twig']->render('login.html.twig');
    }

    public function getContact(Request $request, Application $app)
    {
        $userT = $app['security.token_storage']->getToken()->getUser();
        $user = $app['repository.user']->getUserFromUsername($userT->getUsername());

        $userContact = $app['repository.contact']->getContactFromUser($user);

        return json_encode($userContact);
    }

    public function showProfile(Request $request, Application $app)
    {
        if(isset($_GET['USER_ID']))
        {
            $user = $app['repository.user']->getUserFromId($_GET['USER_ID']);
            $userContact = $app['repository.contact']->getContactFromUser($user);
        }
        else{
            $userContact = json_decode($this->getContact($request, $app), true);

            $userT = $app['security.token_storage']->getToken()->getUser();
            $user = $app['repository.user']->getUserFromUsername($userT->getUsername());
        }

        return $app['twig']->render('profile.html.twig', array('contact' => $userContact, 'user' => $user));

    }

    public function showDrivers(Request $request, Application $app)
    {
        $ch = curl_init("http://localhost:4300/drivers/show");
        $options = array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_HTTPHEADER => array('Content-type: application/json'),
        );
        curl_setopt_array($ch, $options);
        $drivers = json_decode(curl_exec($ch));
        echo $drivers;
        curl_close($ch);

        //$drivers = $app['repository.truck']->getDriversObject();
        return $app['twig']->render('drivers.list.html.twig', array('drivers' => $drivers));
    }

}

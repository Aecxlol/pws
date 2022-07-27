<?php

namespace App\Helper;


class Helper
{
    /**
     * @param string $pathInfo
     * @return string
     */
    public static function getPageName(string $pathInfo): string
    {
        $pageTitle = [
            'users' => 'utilisateurs',
            'skills' => 'compétences',
            'portfolio' => 'portfolio'
        ];

        $pattern = '$^\/[a-z]+\/$';
        return $pageTitle[preg_replace($pattern, '', $pathInfo)];
    }
}
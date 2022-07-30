<?php

namespace App\Helper;


class Helper
{
    /**
     * Gets the pathInfo and translate it to french
     * @param string $pathInfo
     * @return string
     */
    public static function getPageName(string $pathInfo): string
    {
        # Replaces /admin/users by users (ex.)
        $pattern  = '/^\/[a-z]+\//';
        $pageName = preg_replace($pattern, '', $pathInfo);

        if (!!preg_match("/users\/?[a-zA-Z0-9]*\/?[a-zA-Z0-9]*/", $pageName)) {
            $pageTitle = 'utilisateurs';
        } elseif (!!preg_match("/skills\/?[a-zA-Z0-9]*\/?[a-zA-Z0-9]*/", $pageName)) {
            $pageTitle = 'compétences';
        } elseif (!!preg_match("/portfolio\/?[a-zA-Z0-9]*\/?[a-zA-Z0-9]*/", $pageName)) {
            $pageTitle = 'portfolio';
        } else {
            $pageTitle = 'tableau de bord';
        }

        return $pageTitle;
    }
}
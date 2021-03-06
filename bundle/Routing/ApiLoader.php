<?php declare(strict_types=1);

namespace Codein\IbexaSeoToolkit\Routing;

use Symfony\Component\Config\Loader\Loader;
use Symfony\Component\Routing\RouteCollection;

/**
 * Class ApiLoader.
 */
final class ApiLoader extends Loader
{
    private const API_REST_RESOURCE = '@IbexaSeoToolkitBundle/Resources/config/routes_rest.yaml';
    private const DEFAULT_RESOURCE = '@IbexaSeoToolkitBundle/Resources/config/routes.yaml';

    private const TYPE = 'yaml';
    private const API_REST_ROUTE_PREFIX = '/api/seo';

    public function load($resource, $type = null)
    {
        $routeCollection = new RouteCollection();

        $importedRoutes = $this->import(self::API_REST_RESOURCE, self::TYPE);

        $routeCollection->addCollection($importedRoutes);
        $routeCollection->addPrefix(self::API_REST_ROUTE_PREFIX);

        $importedRest = $this->import(self::DEFAULT_RESOURCE, self::TYPE);
        $routeCollection->addCollection($importedRest);

        return $routeCollection;
    }

    public function supports($resource, $type = null)
    {
        return 'api_codein_ibexa_seo' === $type;
    }
}

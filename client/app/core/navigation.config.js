/* eslint camelcase: "off" */

/** @ngInject */
export function navConfig(NavigationProvider) {
  const dashboard = createItem(
    N_('Dashboard'),
    'dashboard',
    'fa fa-dashboard'
  );
  const services = createItem(
    N_('Services'),
    'services',
    'pficon pficon-service',
    N_('Total services ordered, both active and retired')
  );
  const orders = createItem(
    N_('Orders'),
    'orders',
    'fa fa-file-o',
    N_('Total orders submitted')
  );
  const requests = createItem(
    N_('Requests'),
    'requests',
    'fa fa-files-o',
    N_('Total pending requests')
  );
  const catalogs = createItem(
    N_('Catalogs'),
    'designer.catalogs',
    'fa fa-folder-open-o',
    N_('The total number of available catalogs')
  );
  const dialogs = createItem(
    N_('Dialogs'),
    'designer.dialogs',
    'pficon pficon-build',
    N_('Total available dialogs')
  );
  const admin = createItem(
    N_('Admin'),
    'administration',
    'fa fa-cog'
  );

  NavigationProvider.configure({
    items: {
      dashboard: dashboard,
      services: services,
      orders: orders,
      requests: requests,
      catalogs: catalogs,
      dialogs: dialogs,
      admin: admin,
    },
  });

  function createItem(title, state, iconClass, badgeTooltip) {
    const item = {
      title: title,
      state: state,
      iconClass: iconClass,
    };

    if (angular.isString(badgeTooltip)) {
      item.badges = [
        {
          count: 0,
          tooltip: badgeTooltip,
        },
      ];
    }

    return item;
  }
}

/** @ngInject */
export function navInit(lodash, CollectionsApi, Navigation, NavCounts) {
  const refreshTimeMs = 60 * 1000;
  const options = {
    hide: 'resources',
    auto_refresh: true,
  };

  NavCounts.add('requests', fetchRequests, refreshTimeMs);
  NavCounts.add('services', fetchServices, refreshTimeMs);
  NavCounts.add('orders', fetchOrders, refreshTimeMs);
  NavCounts.add('catalogs', fetchServiceCatalogs, refreshTimeMs);
  NavCounts.add('dialogs', fetchDialogs, refreshTimeMs);

  function fetchRequests() {
    angular.extend(options, {
      filter: ["approval_state=pending_approval"],
    });

    CollectionsApi.query('requests', options)
      .then(lodash.partial(updateCount, 'requests'));
  }

  function fetchOrders() {
    angular.extend(options, {
      filter: ['state=ordered'],
    });

    CollectionsApi.query('service_orders', options)
      .then(lodash.partial(updateCount, 'orders'));
  }

  function fetchServices() {
    angular.extend(options, {
      filter: ['ancestry=null'],
    });

    CollectionsApi.query('services', options)
      .then(lodash.partial(updateCount, 'services'));
  }

  function fetchServiceCatalogs() {
    angular.extend(options, {
      filter: ['id>0'],
    });

    CollectionsApi.query('service_catalogs', options)
      .then(lodash.partial(updateCount, 'catalogs'));
  }

  function fetchDialogs() {
    angular.extend(options, {
      filter: ['id>0'],
    });
    CollectionsApi.query('service_dialogs', options)
      .then(lodash.partial(updateCount, 'dialogs'));
  }

  function updateCount(item, data) {
    Navigation.items[item].badges[0].count = data.subcount;
  }
}

var model = {
  mgrName: m.prop('John'),
  activeTabMain: m.prop('finance'),
  activeTabSub: m.prop('period')
};

// app =========================================================================
var app = {
  controller: function () {
    this.tabsCtrl = new mc.Tabs.controller(model.activeTabMain);
    this.tabsCtrl2 = new mc.Tabs.controller(model.activeTabSub);
  },
  view: function (ctrl) {
    console.log('\n................app.view', model.mgrName(), model.activeTabMain(), model.activeTabSub());
    var self = this,
      tabOptions = {
        flavor: 'bs/nav-tabs',
        tabs: [
          { name: 'finance', label: 'Financials' },
          { name: 'foo', label: 'Disabled', disabled: true },
          { name: 'staff', label: 'Personnel' },
          { name: 'dropdown', label: 'Dropdown', dropdown: [
            {label: 'Primary actions', type: 'header' },
            {name: 'action1', label: 'Action'},
            {name: 'action2', label: 'Another action', disabled: true },
            {type: 'divider' },
            {label: 'Secondary actions', type: 'header' },
            {name: 'action9', label: 'Separated action' },
            {label: 'Exit bar', redirectTo: '/bar'}
          ]},
          { name: 'exit', label: 'Exit /foo', redirectTo:  '/foo' },
          { name: 'exit2', label: 'Exit /bar', redirectTo:  '/bar', disabled: true }
        ]
      };

    return m('.container', [
      m('p'),
      mc.Tabs.view(ctrl.tabsCtrl, tabOptions),
      renderTabContents(ctrl)
    ]);

    function renderTabContents (ctrl) {
      console.log('.. render TOP', model.activeTabMain());
      switch (model.activeTabMain()) {
        case 'finance':
          return self.renderFinanceContents(ctrl);
        case 'staff':
          return [
            m('p'),
            m('form.col-md-offset-1.col-md-3',
              m('.form-group', [
                m('label', 'Manager'),
                m('input.form-control',
                  {onchange: m.withAttr('value', model.mgrName), value: model.mgrName()}
                )
              ]
              )
            )
          ];
        default:
          return m('h1', model.activeTabMain());
      }
    }
  },

  renderFinanceContents: function (ctrl) {
    var tabOptions = {
      activeTabName: model.activeTabSub,
      flavor: 'bs/nav-pills',
      tabs: [
        { name: 'period', label: 'Sales' },
        { name: 'comment', label: 'Analysis' },
        { name: 'dropdownFinance', label: 'Dropdown', dropdown: [
          { type: 'header', label: 'Primary subactions' },
          { name: 'action1', label: 'Subaction' },
          { name: 'action2', label: 'Another subaction', disabled: true },
          { type: 'divider' },
          { type: 'header', label: 'Secondary actions' },
          { name: 'action9', label: 'Separated subaction' },
          { name: 'exit2', label: 'Redirect to /bar', redirectTo:  '/bar' }
        ]}
      ]
    };

    //var tabsSubCtrl = new mc.Tabs.controller(model.activeTabSub);
    return [
      m('.row', [
        m('p'),
        m('.col-md-offset-2', {style: {border: '1px solid Lightgrey'}}, [
            mc.Tabs.view(ctrl.tabsCtrl2, tabOptions),
            renderFinanceTabContents()
        ]
        )
      ])
    ];

    function renderFinanceTabContents () {
      console.log('.. render FINANCE', model.activeTabSub());
      switch (model.activeTabSub()) {
        case 'period':
          var salesCtrl = new sales.controller();
          return sales.view(salesCtrl);
        case 'comment':
          return m('.row.col-md-offset-1', [
            m('h3', 'Well that sales data sucks!'),
            m('h4', [
                m('span', 'Use the Personnel tab to replace '),
                m('span.mark', model.mgrName()),
                m('span', ' with a new manager.')
              ]
            )
          ]);
        default:
          return m('h1', model.activeTabSub());
      }
    }
  }
};

// sales =======================================================================
var sales = {
  period: [
    ['',      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    ['Units', 100,   125,   130,   120,   115,   140],
    ['Sales', 10000, 12500, 13000, 12000, 11500, 14000]
  ],

  controller: function () {
    this.tableCtrl = new mc.Table.controller(m.prop(sales.period));
  },

  view: function (ctrl) {
    return [
      m('form.col-md-offset-1.col-md-3',
        m('.form-group', [
            m('label', 'Manager'),
            m('input.form-control', {disabled: true, value: model.mgrName()})
          ]
        )
      ),
      mc.Table.view(ctrl.tableCtrl, {selectors: {parent: '.table.table-bordered.table-striped'}})
    ];
  }
};

// foo =========================================================================
var foo = {
  controller: function () { },
  view: function () {
    return m('h1.col-md-offset-1.bg-warning', 'We have redirected to another route');
  }
};

// routing =====================================================================
m.route(document.body, '/', {
  '/': app,
  '/:tab': foo
});
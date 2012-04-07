Ext.data.JsonP.grid({"guide":"<h1>Grids</h1>\n\n<p>The <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> is one of the centerpieces of Ext JS. It's an incredibly versatile component that provides an easy way to display, sort, group, and edit data.</p>\n\n<h2>Basic Grid Panel</h2>\n\n<p><p><img src=\"guides/grid/simple_grid.png\" alt=\"Simple Grid\"></p></p>\n\n<p>Let's get started by creating a basic <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> .  Here's all you need to know to get a simple grid up and running:</p>\n\n<h3>Model and Store</h3>\n\n<p>A <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> is simply a component that displays data contained in a <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a>. A <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> can be thought of as a collection of records, or <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a> instances. For more information on <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a>s and <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a>s see the <a href=\"#/guide/data\">Data guide</a>.  The benefit of this setup is clear separation of concerns.  The <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> is only concerned with displaying the data, while the <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> takes care of fetching and saving the data using its <a href=\"#!/api/Ext.data.proxy.Proxy\" rel=\"Ext.data.proxy.Proxy\" class=\"docClass\">Proxy</a>.</p>\n\n<p>First we need to define a <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a>. A <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a> is just a collection of fields that represents a type of data.  Let's define a model that represents a \"User\":</p>\n\n<pre><code>Ext.define('User', {\n    extend: 'Ext.data.Model',\n    fields: [ 'name', 'email', 'phone' ]\n});\n</code></pre>\n\n<p>Next let's create a <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> that contains several <code>User</code> instances.</p>\n\n<pre><code>var userStore = Ext.create('Ext.data.Store', {\n    model: 'User',\n    data: [\n        { name: 'Lisa', email: 'lisa@simpsons.com', phone: '555-111-1224' },\n        { name: 'Bart', email: 'bart@simpsons.com', phone: '555-222-1234' },\n        { name: 'Homer', email: 'home@simpsons.com', phone: '555-222-1244' },\n        { name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254' }\n    ]\n});\n</code></pre>\n\n<p>For sake of ease we configured the <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> to load its data inline.  In a real world application you'll usually configure the <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> to use a <a href=\"#!/api/Ext.data.proxy.Proxy\" rel=\"Ext.data.proxy.Proxy\" class=\"docClass\">Proxy</a> to load data from the server.  See the <a href=\"#/guide/data\">Data guide</a> for more on using <a href=\"#!/api/Ext.data.proxy.Proxy\" rel=\"Ext.data.proxy.Proxy\" class=\"docClass\">Proxies</a>.</p>\n\n<h3>Grid Panel</h3>\n\n<p>Now that we have a <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a> which defines our data structure, and we've loaded several <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a> instances into a <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a>, we're ready to display the data using a <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a>:</p>\n\n<pre><code>Ext.create('Ext.grid.Panel', {\n    renderTo: Ext.getBody(),\n    store: userStore,\n    width: 400,\n    height: 200,\n    title: 'Application Users',\n    columns: [\n        {\n            text: 'Name',\n            width: 100,\n            sortable: false,\n            hideable: false,\n            dataIndex: 'name'\n        },\n        {\n            text: 'Email Address',\n            width: 150,\n            dataIndex: 'email',\n            hidden: true\n        },\n        {\n            text: 'Phone Number',\n            flex: 1,\n            dataIndex: 'phone'\n        }\n    ]\n});\n</code></pre>\n\n<p>And that's all there is to it.  We just created a <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> that renders itself to the body element, and we told it to get its data from the <code>userStore</code> <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> that we created earlier.  Finally we defined what columns the <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> will have, and we used the <code>dataIndex</code> property to configure which field in the <code>User</code> <a href=\"#!/api/Ext.data.Model\" rel=\"Ext.data.Model\" class=\"docClass\">Model</a> each column will get its data from.  The <code>Name</code> column has a fixed width of 100px and has sorting and hiding disabled, the <code>Email Address</code> column is hidden by default (it can be shown again by using the menu on any other column), and the <code>Phone Number</code> column flexes to fit the remainder of the <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a>'s total width.  To view this example live, see the <a href=\"guides/grid/examples/simple_grid/index.html\">Simple Grid Example</a>.</p>\n\n<h2>Renderers</h2>\n\n<p>You can use the <code>renderer</code> property of the column config to change the way data is displayed. A renderer is a function that modifies the underlying value and returns a new value to be displayed. Some of the most common renderers are included in <a href=\"#!/api/Ext.util.Format\" rel=\"Ext.util.Format\" class=\"docClass\">Ext.util.Format</a>, but you can write your own as well:</p>\n\n<pre><code>columns: [\n    {\n        text: 'Birth Date',\n        dataIndex: 'birthDate',\n        // format the date using a renderer from the <a href=\"#!/api/Ext.util.Format\" rel=\"Ext.util.Format\" class=\"docClass\">Ext.util.Format</a> class\n        renderer: Ext.util.Format.dateRenderer('m/d/Y')\n    },\n    {\n        text: 'Email Address',\n        dataIndex: 'email',\n        // format the email address using a custom renderer\n        renderer: function(value) {\n            return Ext.String.format('&lt;a href=\"mailto:{0}\"&gt;{1}&lt;/a&gt;', value, value);\n        }\n    }\n]\n</code></pre>\n\n<p>See the <a href=\"guides/grid/examples/renderers/index.html\">Renderers Example</a> for a live demo that uses custom renderers.</p>\n\n<h2>Grouping</h2>\n\n<p><p><img src=\"guides/grid/grouping.png\" alt=\"Grouping Grid\"></p></p>\n\n<p>Organizing the rows in a <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> into groups is easy, first we specify a <a href=\"#!/api/Ext.data.Store-property-groupField\" rel=\"Ext.data.Store-property-groupField\" class=\"docClass\">groupField</a> property on our store:</p>\n\n<pre><code>Ext.create('Ext.data.Store', {\n    model: 'Employee',\n    data: ...,\n    groupField: 'department'\n});\n</code></pre>\n\n<p>For more on gouping in <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a>s please refer to the <a href=\"#/guide/data\">Data guide</a>.  Next we configure a grid with a grouping <a href=\"#!/api/Ext.grid.feature.Feature\" rel=\"Ext.grid.feature.Feature\" class=\"docClass\">Feature</a> that will handle displaying the rows in groups:</p>\n\n<pre><code>Ext.create('Ext.grid.Panel', {\n    ...\n    features: [{ ftype: 'grouping' }]\n});\n</code></pre>\n\n<p>See <a href=\"guides/grid/examples/grouping/index.html\">Grouping Grid Panel</a> for a live example.</p>\n\n<h2>Selection Models</h2>\n\n<p>Sometimes <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a>s are use only to display data on the screen, but usually it is necessary to interact with or update that data.  All <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a>s have a <a href=\"#!/api/Ext.selection.Model\" rel=\"Ext.selection.Model\" class=\"docClass\">Selection Model</a> which determines how data is selected. The two main types of Selection Model are <a href=\"#!/api/Ext.selection.RowModel\" rel=\"Ext.selection.RowModel\" class=\"docClass\">Row Selection Model</a>, where entire rows are selected, and <a href=\"#!/api/Ext.selection.CellModel\" rel=\"Ext.selection.CellModel\" class=\"docClass\">Cell Selection Model</a>, where individual cells are selected.</p>\n\n<p><a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a>s use a <a href=\"#!/api/Ext.selection.RowModel\" rel=\"Ext.selection.RowModel\" class=\"docClass\">Row Selection Model</a> by default, but it's easy to switch to a <a href=\"#!/api/Ext.selection.CellModel\" rel=\"Ext.selection.CellModel\" class=\"docClass\">Cell Selection Model</a>:</p>\n\n<pre><code>Ext.create('Ext.grid.Panel', {\n    selType: 'cellmodel',\n    store: ...\n});\n</code></pre>\n\n<p>Using a <a href=\"#!/api/Ext.selection.CellModel\" rel=\"Ext.selection.CellModel\" class=\"docClass\">Cell Selection Model</a> changes a couple of things. Firstly, clicking on a cell now selects just that cell (using a <a href=\"#!/api/Ext.selection.RowModel\" rel=\"Ext.selection.RowModel\" class=\"docClass\">Row Selection Model</a> will select the entire row), and secondly the keyboard navigation will walk from cell to cell instead of row to row. Cell-based selection models are usually used in conjunction with editing.</p>\n\n<h2>Editing</h2>\n\n<p><a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> has build in support for editing.  We're going to look at the two main editing modes - row editing and cell editing</p>\n\n<h3>Cell Editing</h3>\n\n<p>Cell editing allows you to edit the data in a <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> one cell at a time.  The first step in implementing cell editing is to configure an editor for each <a href=\"#!/api/Ext.grid.column.Column\" rel=\"Ext.grid.column.Column\" class=\"docClass\">Column</a> in your <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> that should be editable.  This is done using the <a href=\"#!/api/Ext.grid.column.Column-cfg-editor\" rel=\"Ext.grid.column.Column-cfg-editor\" class=\"docClass\">editor</a> config.  The simplest way is to specify just the xtype of the field you want to use as an editor:</p>\n\n<pre><code>Ext.create('Ext.grid.Panel', {\n    ...\n    columns: [\n        {\n            text: 'Email Address',\n            dataIndex: 'email',\n            editor: 'textfield'\n       }\n    ]\n});\n</code></pre>\n\n<p>If you need more control over how the editor field behaves, the <a href=\"#!/api/Ext.grid.column.Column-cfg-editor\" rel=\"Ext.grid.column.Column-cfg-editor\" class=\"docClass\">editor</a> config can also take a config object for a Field.  For example if we are using a <a href=\"#!/api/Ext.form.field.Text\" rel=\"Ext.form.field.Text\" class=\"docClass\">Text Field</a> and we want to require a value:</p>\n\n<pre><code>columns: [\n    text: 'Name',\n    dataIndex: 'name',\n    editor: {\n        xtype: 'textfield',\n        allowBlank: false\n    }\n[\n</code></pre>\n\n<p>You can use any class in the <code>Ext.form.field</code> package as an editor field.  Lets suppose we want to edit a column that contains dates.  We can use a <a href=\"#!/api/Ext.form.field.Date\" rel=\"Ext.form.field.Date\" class=\"docClass\">Date Field</a> editor:</p>\n\n<pre><code>columns: [\n    {\n        text: 'Birth Date',\n        dataIndex: 'birthDate',\n        editor: 'datefield'\n    }\n]\n</code></pre>\n\n<p>Any <a href=\"#!/api/Ext.grid.column.Column\" rel=\"Ext.grid.column.Column\" class=\"docClass\">Ext.grid.column.Column</a>s in a <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> that do not have a <a href=\"#!/api/Ext.grid.column.Column-cfg-editor\" rel=\"Ext.grid.column.Column-cfg-editor\" class=\"docClass\">editor</a> configured will not be editable.</p>\n\n<p>Now that we've configured which columns we want to be editable, and the editor fields that will be used to edit the data, the next step is to specify a selection model. Let's use a <a href=\"#!/api/Ext.selection.CellModel\" rel=\"Ext.selection.CellModel\" class=\"docClass\">Cell Selection Model</a> in our <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> config:</p>\n\n<pre><code>Ext.create('Ext.grid.Panel', {\n    ...\n    selType: 'cellmodel'\n});\n</code></pre>\n\n<p>Finally, to enable editing we need to configure the <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> with a <a href=\"#!/api/Ext.grid.plugin.CellEditing\" rel=\"Ext.grid.plugin.CellEditing\" class=\"docClass\">Cell Editing Plugin</a>:</p>\n\n<pre><code>Ext.create('Ext.grid.Panel', {\n    ...\n    selType: 'cellmodel',\n    plugins: [\n        Ext.create('Ext.grid.plugin.CellEditing', {\n            clicksToEdit: 1\n        })\n    ]\n});\n</code></pre>\n\n<p>And that's all it takes to create an editable grid using cell editing. See <a href=\"guides/grid/examples/cell_editing\">Cell Editing</a> for a working example.</p>\n\n<p><p><img src=\"guides/grid/cell_editing.png\" alt=\"Cell Editing Grid\"></p></p>\n\n<h3>Row Editing</h3>\n\n<p>Row editing enables you to edit an entire row at a time, rather than editing cell by cell. Row editing works in exactly the same way as cell editing - all we need to do is change the plugin type to <a href=\"#!/api/Ext.grid.plugin.RowEditing\" rel=\"Ext.grid.plugin.RowEditing\" class=\"docClass\">Ext.grid.plugin.RowEditing</a> and set the selType to <code>rowmodel</code>.</p>\n\n<pre><code>Ext.create('Ext.grid.Panel', {\n    ...\n    selType: 'rowmodel',\n    plugins: [\n        Ext.create('Ext.grid.plugin.RowEditing', {\n            clicksToEdit: 1\n        })\n    ]\n});\n</code></pre>\n\n<p><a href=\"guides/grid/examples/row_editing\">Row Editing - Live Example</a></p>\n\n<p><p><img src=\"guides/grid/row_editing.png\" alt=\"Row Editing Grid\"></p></p>\n\n<h2>Paging</h2>\n\n<p>Sometimes your data set is too large to display all on one page.  <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a> supports two different methods of paging - <a href=\"#!/api/Ext.toolbar.Paging\" rel=\"Ext.toolbar.Paging\" class=\"docClass\">Paging Toolbar</a> which loads pages using previous/next buttons, and <a href=\"#!/api/Ext.grid.PagingScroller\" rel=\"Ext.grid.PagingScroller\" class=\"docClass\">Paging Scroller</a> which loads new pages inline as you scroll.</p>\n\n<h3>Store Setup</h3>\n\n<p>Before we can set up either type of paging on a <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a>, we have to configure the <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> to support paging.  In the below example we add a <a href=\"#!/api/Ext.data.Store-cfg-pageSize\" rel=\"Ext.data.Store-cfg-pageSize\" class=\"docClass\">pageSize</a> to the <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a>, and we configure our <a href=\"#!/api/Ext.data.reader.Reader\" rel=\"Ext.data.reader.Reader\" class=\"docClass\">Reader</a> with a <a href=\"#!/api/Ext.data.reader.Reader-cfg-totalProperty\" rel=\"Ext.data.reader.Reader-cfg-totalProperty\" class=\"docClass\">totalProperty</a>:</p>\n\n<pre><code>Ext.create('Ext.data.Store', {\n    model: 'User',\n    autoLoad: true,\n    pageSize: 4,\n    proxy: {\n        type: 'ajax',\n        url : 'data/users.json',\n        reader: {\n            type: 'json',\n            root: 'users',\n            totalProperty: 'total'\n        }\n    }\n});\n</code></pre>\n\n<p>The <a href=\"#!/api/Ext.data.reader.Reader-cfg-totalProperty\" rel=\"Ext.data.reader.Reader-cfg-totalProperty\" class=\"docClass\">totalProperty</a> config tells the <a href=\"#!/api/Ext.data.reader.Reader\" rel=\"Ext.data.reader.Reader\" class=\"docClass\">Reader</a> where to get the total number of results in the JSON response.  This <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> is configured to consume a JSON response that looks something like this:</p>\n\n<pre><code>{\n    \"success\": true,\n    \"total\": 12,\n    \"users\": [\n        { \"name\": \"Lisa\", \"email\": \"lisa@simpsons.com\", \"phone\": \"555-111-1224\" },\n        { \"name\": \"Bart\", \"email\": \"bart@simpsons.com\", \"phone\": \"555-222-1234\" },\n        { \"name\": \"Homer\", \"email\": \"home@simpsons.com\", \"phone\": \"555-222-1244\" },\n        { \"name\": \"Marge\", \"email\": \"marge@simpsons.com\", \"phone\": \"555-222-1254\" }\n    ]\n}\n</code></pre>\n\n<p>For more on <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Stores</a>, <a href=\"#!/api/Ext.data.proxy.Proxy\" rel=\"Ext.data.proxy.Proxy\" class=\"docClass\">Proxies</a>, and <a href=\"#!/api/Ext.data.reader.Reader\" rel=\"Ext.data.reader.Reader\" class=\"docClass\">Readers</a> refer to the <a href=\"#/guide/data\">Data Guide</a>.</p>\n\n<h3>Paging Toolbar</h3>\n\n<p>Now that we've setup our <a href=\"#!/api/Ext.data.Store\" rel=\"Ext.data.Store\" class=\"docClass\">Store</a> to support paging, all that's left is to configure a <a href=\"#!/api/Ext.toolbar.Paging\" rel=\"Ext.toolbar.Paging\" class=\"docClass\">Paging Toolbar</a>.  You could put the <a href=\"#!/api/Ext.toolbar.Paging\" rel=\"Ext.toolbar.Paging\" class=\"docClass\">Paging Toolbar</a> anywhere in your application layout, but typically it is docked to the <a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Grid Panel</a>:</p>\n\n<pre><code>Ext.create('Ext.grid.Panel', {\n    store: userStore,\n    columns: ...,\n    dockedItems: [{\n        xtype: 'pagingtoolbar',\n        store: userStore,   // same store GridPanel is using\n        dock: 'bottom',\n        displayInfo: true\n    }]\n});\n</code></pre>\n\n<p><p><img src=\"guides/grid/paging_toolbar.png\" alt=\"Paging Toolbar\"></p></p>\n\n<p><a href=\"guides/grid/examples/paging_toolbar/index.html\">Paging Toolbar Example</a></p>\n\n<h3>Paging Scroller</h3>\n\n<p>Grid supports infinite scrolling as an alternative to using a paging toolbar. Your users can scroll through thousands of records without the performance penalties of renderering all the records on screen at once. The grid should be bound to a store with a pageSize specified.</p>\n\n<pre><code>Ext.create('Ext.grid.Panel', {\n    // Use a PagingGridScroller (this is interchangeable with a PagingToolbar)\n    verticalScrollerType: 'paginggridscroller',\n    // do not reset the scrollbar when the view refreshs\n    invalidateScrollerOnRefresh: false,\n    // infinite scrolling does not support selection\n    disableSelection: true,\n    // ...\n});\n</code></pre>\n\n<p><a href=\"extjs/examples/grid/infinite-scroll.html\">Infinite Scrolling Example</a></p>\n","title":"The Grid Component"});
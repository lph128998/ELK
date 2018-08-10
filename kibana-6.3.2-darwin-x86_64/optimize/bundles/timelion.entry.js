
/**
 * Test entry file
 *
 * This is programatically created and updated, do not modify
 *
 * context: {
  "env": "production",
  "kbnVersion": "6.3.2",
  "buildNum": 17307,
  "plugins": [
    "apm",
    "cloud",
    "console",
    "console_extensions",
    "dashboard_mode",
    "elasticsearch",
    "graph",
    "grokdebugger",
    "index_management",
    "input_control_vis",
    "kbn_doc_views",
    "kbn_vislib_vis_types",
    "kibana",
    "license_management",
    "logstash",
    "markdown_vis",
    "metric_vis",
    "metrics",
    "ml",
    "monitoring",
    "region_map",
    "reporting",
    "searchprofiler",
    "security",
    "spy_modes",
    "state_session_storage_redirect",
    "status_page",
    "table_vis",
    "tagcloud",
    "tile_map",
    "tilemap",
    "timelion",
    "vega",
    "watcher",
    "xpack_main"
  ]
}
 */

require('ui/chrome');
require('plugins/timelion/app');
require('plugins/apm/hacks/toggle_app_link_in_nav');
require('plugins/console/hacks/register');
require('plugins/graph/hacks/toggle_app_link_in_nav');
require('plugins/grokdebugger/sections/grokdebugger/register');
require('plugins/kibana/dashboard/saved_dashboard/saved_dashboard_register');
require('plugins/kibana/dev_tools/hacks/hide_empty_tools');
require('plugins/kibana/discover/saved_searches/saved_search_register');
require('plugins/kibana/field_formats/register');
require('plugins/kibana/visualize/saved_visualizations/saved_visualization_register');
require('plugins/ml/hacks/toggle_app_link_in_nav');
require('plugins/monitoring/hacks/toggle_app_link_in_nav');
require('plugins/reporting/hacks/job_completion_notifier');
require('plugins/searchprofiler/register');
require('plugins/security/hacks/on_session_timeout');
require('plugins/security/hacks/on_unauthorized_response');
require('plugins/security/views/nav_control');
require('plugins/timelion/lib/panel_registry');
require('plugins/timelion/panels/timechart/timechart');
require('plugins/xpack_main/hacks/check_xpack_info_change');
require('plugins/xpack_main/hacks/telemetry_opt_in');
require('plugins/xpack_main/hacks/telemetry_trigger');
require('ui/chrome').bootstrap(/* xoxo */);


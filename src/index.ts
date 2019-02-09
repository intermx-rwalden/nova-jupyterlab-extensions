import { URLExt } from '@jupyterlab/coreutils';

import '../style/index.css';

import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

import {
  PageConfig 
} from '@jupyterlab/coreutils';

import { ServerConnection } from '@jupyterlab/services';

/**
 * The plugin registration information.
 */
const plugin: JupyterLabPlugin<void> = {
  activate,
  id: 'my-extension-name:buttonPlugin',
  autoStart: true
};


/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export
class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let callback = () => {
      	  let notebook_path = panel.context.contentsModel.path
	  let a = context.path
	  let b = context.localPath
	  console.log(notebook_path)
	  console.log(a)
	  console.log(b) 
	  console.log(PageConfig.getOption('serverRoot')) 
	  console.log(ServerConnection.makeSettings());
	  let notebook_path_array = notebook_path.split("/")
	  let notebook = notebook_path_array[notebook_path_array.length - 1]
	  let path_to_folder = PageConfig.getOption('serverRoot') + "/" + notebook_path
	  path_to_folder = path_to_folder.substring(0, path_to_folder.length - notebook.length);
          let fullRequest = {
            method: 'POST',
	    body: JSON.stringify(
	      {
	      "home_dir": PageConfig.getOption('serverRoot'),
	      "dir": path_to_folder,
	      "notebook": notebook
	      }
	    )
          };
          let setting = ServerConnection.makeSettings();
          let fullUrl = URLExt.join(setting.baseUrl, "nova");
          ServerConnection.makeRequest(fullUrl, fullRequest, setting);
	  console.log("trololo");
    };
    let button = new ToolbarButton({
      className: 'backgroundTraining',
      iconClassName: 'fa fa-envelope',
      onClick: callback,
      tooltip: 'Submit for background training.'
    });

    panel.toolbar.insertItem(0, 'trainOnBackground', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

/**
 * Activate the extension.
 */
function activate(app: JupyterLab) {
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
};


/**
 * Export the plugin as default.
 */
export default plugin;

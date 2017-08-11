import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild
} from "@angular/core";
import {DatatablesTemplateDirective} from "../datatables-template/datatables-template.directive";
import {DatatablesComponent} from "../datatables/datatables.component";


@Component({
  selector: 'ngx-datatables-portlet',
  templateUrl: './datatables-portlet.component.html',
  styleUrls: ['./datatables-portlet.component.css']
})
export class DatatablesPortletComponent implements OnInit, AfterViewInit, AfterContentInit {

  @ViewChild('toolsPanel')
  private toolsPanelElementRef?: ElementRef;

  @ViewChild('actionsPanel')
  private actionsPanelElementRef?: ElementRef;

  @ViewChild('filterPanel')
  private filterPanelElementRef?: ElementRef;

  @ContentChild(DatatablesComponent)
  private datatablesComponent?: DatatablesComponent;

  @ContentChildren(DatatablesTemplateDirective)
  private templates: QueryList<DatatablesTemplateDirective>;

  public actionsTemplate: DatatablesTemplateDirective;

  public filtersTemplate: DatatablesTemplateDirective;

  @Input()
  caption ?: string;

  @Input()
  description ?: string;

  @Input()
  iconClass?: string;

  @Input()
  filterClass ?: string;

  @Input()
  filterTitle ?: string;

  @Input()
  filterIconClass ?: string;

  @Input()
  fullscreenClass ?: string;

  @Input()
  fullscreenTitle ?: string;

  @Input()
  fullscreenIconClass ?: string;

  @Input()
  showFullscreenIconClass ?: string;

  @Input()
  hideFullscreenIconClass ?: string;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initTools();
  }

  ngAfterContentInit(): void {
    if (this.templates) {
      this.actionsTemplate = this.findTemplateFor('actions');
      this.filtersTemplate = this.findTemplateFor('filters');
      if (this.actionsTemplate)
        this.initActions();
    }
  }

  /*public helper functions*/
  get filtersData(): Object {
    if (this.filtersTemplate) {
      let element = this.filtersTemplate.templateRef.elementRef.nativeElement;
      let forms = element.getElementsByTagName("form");
      return forms && forms.length ? this.serializeToJSON(forms[0]) : {};
    }
    return {};
  }

  /*init of view panels*/
  private initTools() {
    if (this.toolsPanelElementRef) {
      let $toolsPanel = $(this.toolsPanelElementRef.nativeElement);
      $toolsPanel.children('a.btn-outline').off('mouseleave.tools.dt').on('mouseleave.tools.dt', function (e) {
        $(this).blur();
      });
      this.initFilterTool($toolsPanel);
      this.initFullscreenTool($toolsPanel);
    }
  }

  private initActions() {
    if (this.actionsPanelElementRef) {
      let $actionsPanel = $(this.actionsPanelElementRef.nativeElement);
    }
    this.initActionsToolbar(null);
  }

  /* private initActions() {
   if (this.actionsPanelElementRef) {
   let $actionsPanel = $(this.actionsPanelElementRef.nativeElement);
   let $actionPanelActions = $actionsPanel.children('a.btn-outline');
   $actionPanelActions.off('mouseleave.actions.dt').on('mouseleave.actions.dt', function (e) {
   $(this).blur();
   });
   this.initFilterTool($actionsPanel);
   this.initFullscreenTool($actionsPanel);
   }
   }*/

  /* private initFilterComponent2() {
   let $filterPanel = $(this.filterPanelElementRef.nativeElement);
   let $filterBtn = $(this.actionsPanelElementRef.nativeElement).find('a.filter');
   $filterBtn.off('click.dt').on('click.dt', (e) => {
   e.preventDefault();
   let $filterBtnIcon = $filterBtn.find('i:last');
   if ($filterPanel.is(':visible')) {
   //$filterBtnIcon.removeClass('active');
   $filterPanel.slideUp(200, () => {
   $filterBtn.removeClass('active');
   $filterBtnIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
   });
   } else {
   //$filterBtnIcon.removeClass('active');
   $filterPanel.slideDown(200, () => {
   $filterBtn.addClass('active');
   $filterBtnIcon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
   });
   }
   });
   }

   private initFilter() {
   let $filterPanel = $(this.filterPanelElementRef.nativeElement);
   let $filterBtn = $(this.actionsPanelElementRef.nativeElement).find('a.filter');
   let filter_onclick = (e) => {
   if (e)
   e.preventDefault();
   let $filterBtnIcon = $filterBtn.find('i:last');
   if (e ? $filterPanel.is(':visible') : !$filterPanel.is(':visible')) {
   $filterBtn.removeClass('active').addClass('btn-outline');
   $filterPanel.slideUp(200);
   } else {
   $filterBtn.addClass('active').removeClass('btn-outline');
   $filterPanel.slideDown(200);
   }
   };
   $filterBtn.off('click.dt').on('click.dt', filter_onclick);
   filter_onclick(null);
   }*/


  private initFilterTool($toolPanel: JQuery) {
    let $filterBtn = $toolPanel.children('a.filter');
    let $filterPanel = $(this.filterPanelElementRef.nativeElement);
    let $filterBtnIcon = $filterBtn.find('i:last');
    let onclickFilter = (e) => {
      if (e)
        e.preventDefault();
      if (e ? $filterPanel.is(':visible') : !$filterPanel.is(':visible')) {
        $filterBtn.removeClass('active').addClass('btn-outline');
        $filterPanel.slideUp(200);
      } else {
        $filterBtn.addClass('active').removeClass('btn-outline');
        $filterPanel.slideDown(200);
      }
    };
    $filterBtn.off('click.dt').on('click.dt', onclickFilter);
    onclickFilter(null);
  }

  private initFullscreenTool($toolPanel: JQuery) {
    let $fullscreenBtn = $toolPanel.find('a.fullscreen');
    let $fullscreenBtnIcon = $fullscreenBtn.find('i:last');
    let onclickFullscreen = () => {
      setTimeout(() => {
        if ($fullscreenBtn.hasClass('on')) {
          $fullscreenBtnIcon.removeClass('fa-expand').addClass('fa-compress');
          $fullscreenBtn.addClass('active').removeClass('btn-outline');
        } else {
          $fullscreenBtnIcon.removeClass('fa-compress').addClass('fa-expand');
          $fullscreenBtn.removeClass('active').addClass('btn-outline');
        }
      }, 100);
    };
    $fullscreenBtn.off('click.dt').on('click.dt', onclickFullscreen);
    onclickFullscreen();
  }

  private initActionsToolbar($actionsPanel: JQuery) {
    console.log(this.actionsTemplate.templateRef.elementRef.nativeElement);
    if (this.datatablesComponent && this.actionsTemplate) {
      let subscription = this.datatablesComponent.toolbar.subscribe((toolbar: Element) => {
        console.log("=" + toolbar);
        $(toolbar).append($(this.actionsTemplate.templateRef.elementRef.nativeElement));
      });
    }
  }

  /*utility functions*/
  private findTemplateFor(templateName: string): DatatablesTemplateDirective {
    let templates: DatatablesTemplateDirective[] = this.templates != null ? this.templates.filter(template => {
      console.log(template);
      return template.ngxDatatablesTemplate === templateName
    }) : null;
    if (templates != null && templates.length > 1) {
      console.warn(`Multiple '${templateName}' Column template detected [ignored]`);
    }
    return templates == null || templates.length === 0 ? null : templates[0];
  }


  private serializeToJSON(form): {} {
    var json = {};
    $.each($(form).serializeArray(), function (i, n) {
      var _name = undefined;
      var _ = n.name.indexOf('[');
      if (_ > -1) {
        _name = n.name.replace(/\]/gi, '').split('[');
      } else if ((_ = n.name.indexOf('.')) > -1) {
        _name = n.name.split('.');
      }
      if (_ > -1 && _name) {
        var o = json;
        for (var i = 0, len = _name.length; i < len; i++) {
          if (i == len - 1) {
            if (o[_name[i]]) {
              if (typeof o[_name[i]] == 'string' || !o[_name[i]].push) {
                o[_name[i]] = [o[_name[i]]];
              }
              o[_name[i]].push(n.value);
            }
            else o[_name[i]] = n.value || '';
          }
          else o = o[_name[i]] = o[_name[i]] || {};
        }
      }
      else {
        if (json[n.name] !== undefined) {
          if (!json[n.name].push) {
            json[n.name] = [json[n.name]];
          }
          json[n.name].push(n.value || '');
        }
        else json[n.name] = n.value || '';
      }
    });
    return json;
  }
}

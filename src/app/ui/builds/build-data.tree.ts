import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core'
import {IBuildDataTreeNode} from '../../core'
import {CommonModule} from "@angular/common";
import {BuildId} from "./build.id";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatNestedTreeNode, MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource} from "@angular/material/tree";
import {FlatTreeControl, NestedTreeControl} from "@angular/cdk/tree";
import {MatIconModule} from "@angular/material/icon";
import {Observable} from "rxjs";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'bb-build-data-tree',
  template: `
    <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
      <!-- This is the tree node template for leaf nodes -->
      <!-- There is inline padding applied to this node using styles.
        This padding value depends on the mat-icon-button width. -->
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle>
        {{node.name}}
      </mat-tree-node>
      <!-- This is the tree node template for expandable nodes -->
      <mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild">
        <div class="mat-tree-node">
          <button mat-icon-button matTreeNodeToggle
                  [attr.aria-label]="'Toggle ' + node.name">
            <mat-icon class="mat-icon-rtl-mirror">
              {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
            </mat-icon>
          </button>
          {{node.name}}
        </div>
        <!-- There is inline padding applied to this div using styles.
            This padding value depends on the mat-icon-button width.  -->
        <div class="pl-6" [class.hidden]="!treeControl.isExpanded(node)"
             role="group">
          <ng-container matTreeNodeOutlet></ng-container>
        </div>
      </mat-nested-tree-node>
    </mat-tree>
  `,
  standalone: true,
  imports: [CommonModule, BuildId, MatExpansionModule, MatIconModule, MatTreeModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuildDataTree implements OnInit {
  dataSource = new MatTreeNestedDataSource<IBuildDataTreeNode>()
  @Input()
  data!: Observable<IBuildDataTreeNode[]>
  treeControl = new NestedTreeControl<IBuildDataTreeNode>(node => node.children)

  hasChild = (_: number, node: IBuildDataTreeNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.data.subscribe((buildData) => {
      this.dataSource.data = buildData
    })
  }


  nameOf(node: IBuildDataTreeNode): string {
    if (!!node.build) {
      return `${node.build.project} --- ${node.build.branch} --- ${node.build.buildNumber}`
    }
    if (!!node.label) {
      return `${node.label.key} --- ${node.label.value}`
    }
    return 'Something'
  }

  clickedNode(node: IBuildDataTreeNode) {
    console.log("clicked " + node);
  }
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

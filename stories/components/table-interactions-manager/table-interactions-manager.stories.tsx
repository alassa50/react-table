/* eslint-disable  import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { IconButton, Icon } from "@material-ui/core";

import { ColumnWidth } from "../../../src/components/constants";
import { withThemeProvider } from "../../utils/decorators";
import CellDimensionController from "../../../src/components/table-interactions-manager/cell-dimensions-controller";
import ColumnVisibilityController from "../../../src/components/table-interactions-manager/column-visibility-controller";
import ColumnIdScrollController from "../../../src/components/table-interactions-manager/column-id-scroll-controller";
import TabeInteractionManager, {
  TableInteractionsContext
} from "../../../src/components/table-interactions-manager/table-interactions-manager";
import { CellSize } from "../../../src/components/table-interactions-manager/reducers";
import { getTable } from "../styled-table/tables";
import Table from "../../../src/components/table/table";

const defaultProps = getTable();

const toggleableColumns = [
  { id: "W01", index: 1, label: "W01" },
  { id: "W02", index: 2, label: "W02" },
  { id: "W03", index: 3, label: "W03" },
  { id: "W04", index: 4, label: "W04" }
];

const fixedRows = [0];
const fixedColumns = [0];

const storyInfoDefault = {
  inline: true,
  propTables: [CellDimensionController, ColumnVisibilityController, TabeInteractionManager]
};

const toolBarStyle = {
  display: "flex",
  justifyContent: "center"
};

const defaultColumnIdScrollControllerProps = {
  columns: Array.from({ length: 50 }).map((_, i: number) => ({ id: i.toString(), label: `Label_${i}` })),
  defaultValue: "0"
};

storiesOf("Table interactions manager", module)
  .addDecorator(withThemeProvider)
  .addParameters({
    jest: ["cell-dimensions-controller", "column-visibility-controller", "week-scroll-controller", "table-interactions"]
  })
  .add(
    "Cell dimension controller",
    () => (
      <TabeInteractionManager>
        <CellDimensionController
          buttonRenderer={toggleMenu => (
            <IconButton onClick={toggleMenu}>
              <Icon>line_weight</Icon>
            </IconButton>
          )}
        />
      </TabeInteractionManager>
    ),
    {
      info: storyInfoDefault
    }
  )
  .add(
    "Cell dimension controller with default value",
    () => (
      <TabeInteractionManager
        initialConfig={{
          cellWidth: {
            value: ColumnWidth[CellSize.small],
            size: CellSize.small
          }
        }}
      >
        <CellDimensionController
          buttonRenderer={toggleMenu => (
            <IconButton onClick={toggleMenu}>
              <Icon>line_weight</Icon>
            </IconButton>
          )}
        />
      </TabeInteractionManager>
    ),
    {
      info: storyInfoDefault
    }
  )
  .add(
    "Cell visibility controller",
    () => (
      <TabeInteractionManager toggleableColumns={toggleableColumns}>
        <ColumnVisibilityController
          columns={toggleableColumns}
          buttonRenderer={toggleMenu => (
            <IconButton onClick={toggleMenu}>
              <Icon>view_week</Icon>
            </IconButton>
          )}
        />
      </TabeInteractionManager>
    ),
    {
      info: storyInfoDefault
    }
  )
  .add(
    "Cell visibility controller with default value",
    () => (
      <TabeInteractionManager initialConfig={{ hiddenColumnsIds: ["W01"] }} toggleableColumns={toggleableColumns}>
        <ColumnVisibilityController
          columns={toggleableColumns}
          buttonRenderer={toggleMenu => (
            <IconButton onClick={toggleMenu}>
              <Icon>view_week</Icon>
            </IconButton>
          )}
        />
      </TabeInteractionManager>
    ),
    {
      info: storyInfoDefault
    }
  ).add(
    "Column id scroll controller",
    () =>  <ColumnIdScrollController {...defaultColumnIdScrollControllerProps} />
  , {
    info: storyInfoDefault
  })
  .add("Integrated", () => (
    <TabeInteractionManager initialConfig={{ columnsCursor: { id: "03", index: 3 } }} toggleableColumns={toggleableColumns}>
      <TableInteractionsContext.Consumer>
        {({ onHorizontallyScroll, hiddenColumnsIndexes, cellWidth, rowHeight, table, columnsCursor }) => {
          return (
            <>
              <div style={toolBarStyle}>
                <CellDimensionController
                  buttonRenderer={toggleMenu => (
                    <IconButton onClick={toggleMenu}>
                      <Icon>line_weight</Icon>
                    </IconButton>
                  )}
                />
                <ColumnVisibilityController
                  columns={toggleableColumns}
                  buttonRenderer={toggleMenu => (
                    <IconButton onClick={toggleMenu}>
                      <Icon>view_week</Icon>
                    </IconButton>
                  )}
                />
              </div>
              <div
                style={{ height: "calc(100vh - 55px)", width: "100%" }}
                className={cellWidth.size === CellSize.small && "small-table"}
              >
                <Table
                  ref={table}
                  {...defaultProps}
                  columns={{ 0: { style: { justifyContent: "left" }, size: 200 } }}
                  isVirtualized
                  isSelectable={false}
                  virtualizerProps={{
                    hiddenColumns: hiddenColumnsIndexes,
                    minColumnWidth: cellWidth.value,
                    minRowHeight: rowHeight.value,
                    initialScroll: {
                      columnIndex: columnsCursor ? columnsCursor.index : undefined
                    },
                    fixedRows,
                    fixedColumns,
                    onHorizontallyScroll
                  }}
                />
              </div>
            </>
          );
        }}
      </TableInteractionsContext.Consumer>
    </TabeInteractionManager>
  ));

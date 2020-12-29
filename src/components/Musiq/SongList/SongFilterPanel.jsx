import React, {useRef} from 'react';
import { Row, Col, Button, Input, InputNumber, Select, Divider } from 'antd';
const { Option } = Select;

export function SongFilterPanel(props) {
    const { songFilters, setSongFilters, reloadSongs, showTagsDrawer, showNewSongModal } = props;

    function handleTitleFilterChange(event) {
        const title = event.target.value;
        setSongFilters({
            ...songFilters,
            skip: 0,
            title
        });
        reloadSongs();
    }

    function handleSkipFilterChange(value) {
        if (!isNaN(value)) {
            setSongFilters({
                ...songFilters,
                skip: Number(value)
            });
        }
        reloadSongs();
    }

    function handleLimitFilterChange(value) {
        setSongFilters({
            ...songFilters,
            limit: Number(value)
        });
        reloadSongs();
    }

    function handleSortFilterChange(sort) {
        setSongFilters({
            ...songFilters,
            skip: 0,
            sort
        });
        reloadSongs();
    }

    return (
        <Row
            justify="space-between"
            gutter={8}
            style={{ padding: 8 }}
        >
            <Col>
                <Button onClick={showTagsDrawer}>
                    <i className="fas fa-tags"></i>
                </Button>
            </Col>
            <Col flex="auto">
                <Input
                    placeholder="Search song"
                    allowClear={true}
                    value={songFilters.title}
                    onChange={handleTitleFilterChange}
                    prefix={<i className="fas fa-search"></i>}
                />
            </Col>
            <Col>
                {/* Skip */}
                <InputNumber
                    value={songFilters.skip}
                    onChange={handleSkipFilterChange}
                    min={0}
                    precision={0}
                />
            </Col>
            <Col>
                {/* Limit */}
                <Select
                    value={songFilters.limit}
                    onChange={handleLimitFilterChange}>
                    <Option value={10}>10</Option>
                    <Option value={30}>30</Option>
                    <Option value={50}>50</Option>
                </Select>
            </Col>
            <Col>
                {/* Sort */}
                <Select
                    style={{ width: 90}}
                    value={songFilters.sort}
                    onChange={handleSortFilterChange}
                >
                    <Option value="none">None</Option>
                    <Option value="title_asc">Title Asc</Option>
                    <Option value="title_desc">Title Desc</Option>
                    <Option value="random">Random</Option>
                </Select>
            </Col>
            <Col>
                <Button onClick={showNewSongModal}>
                    <i className="fas fa-plus"></i>
                </Button>
            </Col>
        </Row>
    );
}

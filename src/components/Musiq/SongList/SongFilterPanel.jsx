import React, { useState } from 'react';
import { Row, Col, Button, Input, InputNumber, Select } from 'antd';
const { Option } = Select;

import { NewSongModal } from './NewSongModal';

export function SongFilterPanel(props) {
    const { songFilters, setSongFilters, showTagsDrawer, addSong } = props;
    const [isNewSongModalVisible, setIsNewSongModalVisible] = useState(false);

    function handleTitleFilterChange(event) {
        const title = event.target.value;
        setSongFilters({
            ...songFilters,
            skip: 0,
            title
        });
    }

    function handleSkipFilterChange(value) {
        if (!isNaN(value)) {
            setSongFilters({
                ...songFilters,
                skip: Number(value)
            });
        }
    }

    function handleLimitFilterChange(value) {
        setSongFilters({
            ...songFilters,
            limit: Number(value)
        });
    }

    function handleSortFilterChange(sort) {
        setSongFilters({
            ...songFilters,
            skip: 0,
            sort
        });
    }

    return (
        <>
            <NewSongModal
                addSong={addSong}
                isVisible={isNewSongModalVisible}
                closeModal={() => setIsNewSongModalVisible(false)}
            />
            <Row
                justify="space-between"
                gutter={8}
                style={{ padding: 8 }}
            >
                <Col lg={0}>
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
                    <Button onClick={() => setIsNewSongModalVisible(true)}>
                        <i className="fas fa-plus"></i>
                    </Button>
                </Col>
            </Row>
        </>
    );
}

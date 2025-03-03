import React from 'react'
import _ from 'lodash'
import { Breadcrumb } from 'rsuite'

const ControlBreadcrumb = ({menu, title, onMenuClick}) => {
    return (
        <Breadcrumb separator={'>'}>{menu && <Breadcrumb.Item onClick={onMenuClick} style={{cursor: onMenuClick ? 'pointer': 'auto'}}><h3 className="title">{menu}</h3></Breadcrumb.Item>}<Breadcrumb.Item active><h3 className="title">{title}</h3></Breadcrumb.Item></Breadcrumb>
    )
}

export const CustomBreadcrumb = ControlBreadcrumb
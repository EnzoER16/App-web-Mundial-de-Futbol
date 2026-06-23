from abc import ABC, abstractmethod
from config.db import db

class BaseController(ABC):
    model = None
    id_field = None

    def get_all(self, filters=None):
        query = self.model.query
        if filters:
            query = self._apply_filters(query, filters)
        records = query.all()
        return [record.to_json() for record in records]

    def get_by_id(self, record_id):
        record = self.model.query.get(record_id)
        if not record:
            return None
        return record.to_json()

    @abstractmethod
    def create(self, data):
        raise NotImplementedError

    @abstractmethod
    def update(self, record_id, data):
        raise NotImplementedError

    def delete(self, record_id):
        record = self.model.query.get(record_id)
        if not record:
            return False
        db.session.delete(record)
        db.session.commit()
        return True

    def _apply_filters(self, query, filters):
        return query

    def _save(self, instance):
        db.session.add(instance)
        db.session.commit()
        return instance
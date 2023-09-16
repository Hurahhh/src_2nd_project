import { Component, EventEmitter, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';

import { GroupBusiness } from 'src/app/@core/businesses/group.business';
import { GroupMasterDto } from 'src/app/@core/dtos/group.dto';

@Component({
  selector: 'gmm-group-master',
  templateUrl: './group-master.component.html',
  styleUrls: ['./group-master.component.css'],
})
export class GroupMasterComponent {
  groups: GroupMasterDto[] = [];
  isLoading = true;
  isVisibleUpsert = false;
  @Output() targetGroupChange = new EventEmitter<GroupMasterDto>();
  activeIndex: number = -1;

  constructor(private auth: Auth, private groupBusiness: GroupBusiness) {}

  ngOnInit(): void {
    this.onGroupSaved();
  }

  ngOnDestroy(): void {}

  onAddGroup() {
    this.isVisibleUpsert = true;
  }

  onGroupSaved() {
    this.isLoading = true;
    this.groupBusiness
      .getJoinedGroupsByUserId(this.auth.currentUser!.uid)
      .then((groups) => {
        this.groups = groups;
        this.isLoading = false;
      });
  }

  onClickGroup(group: GroupMasterDto) {
    this.targetGroupChange.emit(group);
    this.activeIndex = this.groups.indexOf(group);
  }
}
